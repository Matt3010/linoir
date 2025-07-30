import WebSocket, {RawData} from 'ws';
import {IncomingMessage} from 'node:http';

let usersConnected = 0;

export type WSType = WebSocket.Server<typeof WebSocket.WebSocket, typeof IncomingMessage>;

export function startWebSocketServer(ip: string, port: number): WSType {
  usersConnected = 0;
  const server = new WebSocket.Server({port, host: '0.0.0.0'});

  server.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log('New client connected:', clientIp);
    usersConnected++;
    console.log(usersConnected)

    ws.on('message', (data: RawData, isBinary: boolean) => {
      if (isBinary) {
        console.log('Received binary data from client, length:', data);
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

  return server;
}
