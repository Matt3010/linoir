const {getLocalIp, writeServerConfig} = require('./config');
const {startWebSocketServer} = require('./websocket');
const {runAngular} = require('./angular-runner');
const {generateManifest} = require('./register-manifest');

const mode = process.env.NODE_ENV || 'development';
const WS_PORT = 3333;

(async () => {
  try {
    const ip = mode === 'development' ? getLocalIp() : 'host.docker.internal';
    console.log(`🚀 Environment: ${mode}`);
    console.log(`🌐 IP: ${ip}`);
    console.log(`📡 WebSocket Port: ${WS_PORT}`);

    if (mode === 'development') {
      writeServerConfig(ip);
    }

    // Registra i plugin all'avvio
    generateManifest();

    // Avvia il server WebSocket
    startWebSocketServer(ip, WS_PORT);

    // Avvia Angular solo in modalità sviluppo
    if (mode === 'development') {
      runAngular(mode, ip);
    }

  } catch (err) {
    console.error('❌ Errore durante l\'avvio:', err);
    process.exit(1);
  }
})();
