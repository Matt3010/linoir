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

fs.writeFileSync(configPath, JSON.stringify({ip: localIp}, null, 2), 'utf-8');
console.log(`Server config scritto in ${configPath}`);

const wss = new WebSocket.Server({port: 3333, host: '0.0.0.0'});

wss.on('connection', (ws, req) => {
  console.log('Nuovo client connesso:', req.socket.remoteAddress);

  ws.on('message', (message) => {
    console.log('Messaggio ricevuto dal client:', message);
    ws.send(`Server ha ricevuto: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnesso');
  });

  ws.on('error', (err) => {
    console.error('Errore WebSocket:', err);
  });
});

console.log(`WebSocket server running on ws://${localIp}:3333`);
