const fs = require('fs');
const path = require('path');
const ip = require('ip');

const publicPath = path.resolve(__dirname, '../public');
const configPath = path.join(publicPath, 'server-config.json');

function getLocalIp() {
  const localIp = ip.address();
  return localIp || '127.0.0.1';
}

function writeServerConfig(ip) {
  try {
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, {recursive: true});
    }
    fs.writeFileSync(configPath, JSON.stringify({ip}, null, 2), 'utf-8');
    console.log(`Server config written to ${configPath}`);
  } catch (error) {
    console.error('Error writing server config:', error);
  }
}

module.exports = {
  getLocalIp,
  writeServerConfig,
};
