const WebSocket = require('ws');

let usersConnected = 0;

function startWebSocketServer(ip, port) {
  usersConnected = 0;
  const server = new WebSocket.Server({port, host: '0.0.0.0'});

  server.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log('New client connected:', clientIp);
    usersConnected++;
    console.log(usersConnected)

    ws.on('message', (data, isBinary) => {
      if (isBinary) {
        console.log('Received binary data from client, length:', data.length);
      } else {
        const message = data.toString();
        console.log('Received text from client:', message);
      }

      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data, {binary: isBinary});
        }
      });
    });

    ws.on('close', () => {
      usersConnected--;
      console.log('Client disconnected:', clientIp);
      console.log(usersConnected)
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  });


  console.log(`WebSocket server running on ws://${ip}:${port}`);
}

module.exports = {startWebSocketServer};
