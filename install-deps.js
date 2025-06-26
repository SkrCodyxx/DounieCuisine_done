const { spawn } = require('child_process');
const path = require('path');

async function installDependencies() {
  console.log('Installing dependencies for all applications...');
  
  const apps = ['api', 'public', 'administration'];
  
  for (const app of apps) {
    console.log(`Installing ${app} dependencies...`);
    
    const install = spawn('npm', ['install'], {
      cwd: path.join(__dirname, app),
      stdio: 'inherit',
      shell: true
    });
    
    await new Promise((resolve) => {
      install.on('close', resolve);
    });
  }
  
  console.log('All dependencies installed successfully!');
}

installDependencies().catch(console.error);