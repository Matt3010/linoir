const path = require('path');
const os = require('os');
const fs = require('fs');
const WebSocket = require('ws');
const {spawn} = require('child_process');

const mode = process.env.NODE_ENV || 'development';
const isDev = mode === 'development';

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const ifaceName in interfaces) {
    for (const iface of interfaces[ifaceName]) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.')) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const localIp = getLocalIp();
const WS_PORT = 3333;
const HOST = '0.0.0.0';

const publicPath = path.resolve(__dirname, 'public');
const configPath = path.join(publicPath, 'server-config.json');

try {
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, {recursive: true});
  }
  fs.writeFileSync(configPath, JSON.stringify({ip: localIp}, null, 2), 'utf-8');
  console.log(`Server config written to ${configPath}`);
} catch (error) {
  console.error('Error writing server config:', error);
}

// Avvio WebSocket server
const wss = new WebSocket.Server({port: WS_PORT, host: HOST});

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log('New client connected:', clientIp);

  ws.on('message', (data, isBinary) => {
    if (isBinary) {
      console.log('Received binary data from client, length:', data.length);
    } else {
      const message = data.toString();
      console.log('Received text from client:', message);
    }

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, {binary: isBinary});
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected:', clientIp);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

console.log(`WebSocket server running on ws://${localIp}:${WS_PORT}`);
if (isDev) {
  console.log(`Launching Angular app in development mode on http://${localIp}:4200...`);
  const ngServe = spawn('npx', ['ng', 'serve', '--host', localIp, '--configuration=development'], {
    stdio: 'inherit',
    shell: true,
  });

  ngServe.on('error', (err) => {
    console.error('Failed to start ng serve:', err);
  });

  ngServe.on('exit', (code) => {
    console.log(`ng serve exited with code ${code}`);
  });
} else {
  // Solo build, nessun server HTTP Node.js
  console.log('Building Angular app for production...');
  const ngBuild = spawn('npx', ['ng', 'build', '--configuration=production'], {
    stdio: 'inherit',
    shell: true,
  });

  ngBuild.on('exit', (code) => {
    if (code === 0) {
      console.log('Production build complete. Serve with Nginx separately.');
    } else {
      console.error(`ng build failed with code ${code}`);
    }
  });
}
