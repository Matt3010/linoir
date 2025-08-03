import WebSocket, {Data} from 'ws';
import {IncomingMessage} from 'node:http';

let _usersConnected: number = 0;
export const usersConnected = _usersConnected;

// Define a type for the WebSocket server instance for better type safety.
export type WSType = WebSocket.Server<typeof WebSocket.WebSocket, typeof IncomingMessage>;

// Interface for a structured message, although not strictly enforced in the handler.
export interface Message<AnyPayload = any> {
  topic: string;
  payload: AnyPayload;
  ignoreSelf: boolean;
}

/**
 * Handles incoming WebSocket messages, parsing them and broadcasting to clients.
 * @param server - The WebSocket server instance.
 * @param ws - The specific WebSocket connection that received the message.
 *- @param data - The raw message data.
 * @param data
 */
function handleMessage(server: WSType, ws: WebSocket, data: string): void {
  let ignoreSelf = false;

  console.log('Received text from client:', data);

  try {
    const parsed: any = JSON.parse(data);
    if (parsed.ignoreSelf) {
      ignoreSelf = true;
    }
  } catch {
  }

  // Broadcast the message to all connected clients.
  server.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      if (ignoreSelf) {
        if (client !== ws) {
          console.log('Sending to all clients except self');
          client.send(data);
        }
      } else {
        console.log('Sending to all clients');
        client.send(data);
      }
    }
  });
}

/**
 * Starts and configures the WebSocket server.
 * @param ip - The IP address to bind the server to.
 * @param port - The port number for the server.
 * @returns The created WebSocket server instance.
 */
export function startWebSocketServer(ip: string, port: number): WSType {
  _usersConnected = 0;
  const server = new WebSocket.Server({port, host: '0.0.0.0'});

  server.on('connection', (ws) => {
    _usersConnected++;
    console.log('Total users connected:', _usersConnected);

    // Use the dedicated handler for the 'message' event.
    ws.on('message', (data: Data) => {
      handleMessage(server, ws, data.toString());
    });

    ws.on('close', (): void => {
      _usersConnected--;
      console.log('Total users connected:', _usersConnected);
    });

    ws.on('error', (err: Error): void => {
      console.error('WebSocket error:', err);
    });
  });

  console.log(`WebSocket server running on ws://${ip}:${port}`);

  return server;
}
