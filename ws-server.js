const path = require('path');
const fs = require('fs');
const os = require('os');
const WebSocket = require('ws');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const ifaceName of Object.keys(interfaces)) {
    for (const iface of interfaces[ifaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const localIp = getLocalIp();

const publicPath = path.resolve(__dirname, 'public');
const configPath = path.join(publicPath, 'server-config.json');

try {
  fs.writeFileSync(configPath, JSON.stringify({ip: localIp}, null, 2), 'utf-8');
  console.log(`Server config written to ${configPath}`);
} catch (error) {
  console.error('Error writing server config:', error);
}

const wss = new WebSocket.Server({port: 3333, host: '0.0.0.0'});

wss.on('connection', (ws, req) => {
  console.log('New client connected:', req.socket.remoteAddress);

  ws.on('message', (message) => {
    console.log('Message received from client:', message.toString());
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

console.log(`WebSocket server running on ws://${localIp}:3333`);
