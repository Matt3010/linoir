const {getLocalIp, writeServerConfig} = require("./config");
const {startWebSocketServer} = require("./websocket");
const {runAngular} = require("./angular-runner");
const {config} = require("dotenv");


const mode = process.env.NODE_ENV || "development";
const WS_PORT = 3333;

(async () => {
  if (mode === "development") {
    config();
  }

  try {
    const ip = mode === 'development' ? getLocalIp() : 'host.docker.internal';
    console.log(`🚀 Environment: ${mode}`);
    console.log(`🌐 IP Address: ${ip}`);
    console.log(`📡 WebSocket Port: ${WS_PORT}`);

    if (mode === 'development') {
      writeServerConfig(ip);
    }

    startWebSocketServer(ip, WS_PORT);

    if (mode === 'development') {
      runAngular(mode, ip);
    }

  } catch (err) {
    console.error('❌ Error during startup:', err);
    process.exit(1);
  }
})();
