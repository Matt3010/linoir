const {getLocalIp, writeServerConfig} = require('./config');
const {startWebSocketServer} = require('./websocket');
const {runAngular} = require('./angular-runner');

const mode = process.env.NODE_ENV || 'development';
const WS_PORT = 3333;

(async () => {
  try {
    const ip = mode === 'development' ? getLocalIp() : 'host.docker.internal';
    console.log(`🚀 Environment: ${mode}`);
    console.log(`🌐 IP Address: ${ip}`);
    console.log(`📡 WebSocket Port: ${WS_PORT}`);

    if (mode === 'development') {
      writeServerConfig(ip);
    }

    // Start WebSocket server
    startWebSocketServer(ip, WS_PORT);

    // Start Angular only in development mode
    if (mode === 'development') {
      runAngular(mode, ip);
    }

  } catch (err) {
    console.error('❌ Error during startup:', err);
    process.exit(1);
  }
})();
