import {config} from 'dotenv';
import {getLocalIp, writeServerConfig} from './config';
import {startWebSocketServer, WSType} from './websocket';
import {runAngular} from './angular-runner';
import {loginWithSignInQr} from './TelegramPlugin/auth';

const mode = process.env.NODE_ENV ?? "development";
const WS_PORT = 3333;

function main() {
  if (mode === "development") {
    config();
  }

  try {
    const ip: string = mode === "development" ? getLocalIp() : "host.docker.internal";
    console.log(`Environment: ${mode}`);
    console.log(`IP Address: ${ip}`);
    console.log(`WebSocket Port: ${WS_PORT}`);

    if (mode === "development") {
      writeServerConfig(ip);
    }

    const WsServer: WSType = startWebSocketServer(ip, WS_PORT);
    loginWithSignInQr(WsServer).then(() => {
      console.log("Telegram login initiated successfully.");
    });


    if (mode === "development") {
      runAngular(ip);
    }

  } catch (err) {
    console.error("Error during startup:", err);
    process.exit(1);
  }
}

main();
