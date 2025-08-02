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
      let ignoreSelf: boolean = false;

      if (isBinary) {
        console.log('Received binary data from client, length:', data);
      } else {
        let message: string;
        if (Buffer.isBuffer(data)) {
          message = data.toString('utf-8');
        } else if (data instanceof ArrayBuffer) {
          message = Buffer.from(data).toString('utf-8');
        } else if (Array.isArray(data)) { // Buffer[]
          message = Buffer.concat(data).toString('utf-8');
        } else {
          message = String(data);
        }
        console.log('Received text from client:', message);
        try {
          const parsed: any = JSON.parse(message);
          if (parsed.ignoreSelf) {
            ignoreSelf = true;
          }
        } catch {
          // not a json message, ignore
        }
      }

      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          if (ignoreSelf) {
            if (client !== ws) {
              client.send(data, {binary: isBinary});
            }
          } else {
            client.send(data, {binary: isBinary});
          }
        }
      });
    });

    ws.on('close', (): void => {
      usersConnected--;
      console.log('Client disconnected:', clientIp);
      console.log(usersConnected)
    });

    ws.on('error', (err: Error): void => {
      console.error('WebSocket error:', err);
    });
  });

  console.log(`WebSocket server running on ws://${ip}:${port}`);

  return server;
}
