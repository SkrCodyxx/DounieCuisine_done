const { execSync, spawn } = require('child_process');
const path = require('path');

console.log('Starting Dounie Cuisine Restaurant Management System...');

// Install dependencies in API directory if needed
try {
  console.log('Checking API dependencies...');
  execSync('cd api && npm install --silent', { stdio: 'pipe' });
  console.log('API dependencies ready');
} catch (err) {
  console.log('API dependencies already installed or installation not needed');
}

// Start API server
const api = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'api'),
  stdio: 'inherit',
  shell: true,
  env: { 
    ...process.env, 
    NODE_ENV: 'development',
    PORT: '5000'
  }
});

api.on('error', (err) => {
  console.error('API startup failed:', err.message);
  process.exit(1);
});

process.on('SIGINT', () => {
  api.kill();
  process.exit();
});