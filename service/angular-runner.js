const {spawn} = require('child_process');

function runAngular(mode, ip) {
  if (mode === 'development') {
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

  } else {
    console.log('Building Angular app for production...');
    const ngBuild = spawn('npx', ['ng', 'build', '--configuration=production'], {
      stdio: 'inherit',
      shell: true,
    });

    ngBuild.on('exit', (code) => {
      if (code === 0) {
        console.log('Production build complete. Serve with Nginx separately.');
      } else {
        console.error(`ng build failed with code ${code}`);
      }
    });
  }
}

module.exports = {runAngular};

