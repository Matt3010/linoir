const path = require('path');
const fs = require('fs');
const os = require('os');
const WebSocket = require('ws');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const ifaceName in interfaces) {
    for (const iface of interfaces[ifaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const localIp = getLocalIp();
const PORT = 3333;
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

const wss = new WebSocket.Server({port: PORT, host: HOST});

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

console.log(`WebSocket server running on ws://${localIp}:${PORT}`);
