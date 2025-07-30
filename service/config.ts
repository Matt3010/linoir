import path from 'node:path';
import ip from 'ip';
import * as fs from 'node:fs';

const publicPath = path.resolve(__dirname, '../public');
const configPath = path.join(publicPath, 'server-config.json');

export function getLocalIp(): string {
  const localIp: string = ip.address();
  return localIp ?? '127.0.0.1';
}

export function writeServerConfig(ip: string): void {
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
