import {spawn} from 'node:child_process';

export function runAngular(ip: string) {
  console.log(`Launching Angular app in development mode on http://${ip}:4200...`);
  const ngServe = spawn('npx', ['ng', 'serve', '--host', ip, '--configuration=development'], {
    stdio: 'inherit',
    shell: true,
  });

  ngServe.on('error', (err) => {
    console.error('Failed to start ng serve:', err);
  });

  ngServe.on('exit', (code) => {
    console.log(`ng serve exited with code ${code}`);
  });

}


