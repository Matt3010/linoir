const os = require('os');
const fs = require('fs');
const path = require('path');

const publicPath = path.resolve(__dirname, '../public');
const configPath = path.join(publicPath, 'server-config.json');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const ifaceName in interfaces) {
    for (const iface of interfaces[ifaceName]) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.')) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
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
