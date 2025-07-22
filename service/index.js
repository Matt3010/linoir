const {getLocalIp, writeServerConfig} = require('./config');
const {startWebSocketServer} = require('./websocket');
const {runAngular} = require('./angular-runner');

const mode = process.env.NODE_ENV || 'development';
const WS_PORT = 3333;

const ip = getLocalIp();
writeServerConfig(ip);
startWebSocketServer(ip, WS_PORT);
if (mode === 'development') {
  runAngular(mode, ip);
}
