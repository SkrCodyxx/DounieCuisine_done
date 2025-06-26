const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Dounie Cuisine Restaurant Management System...');

// Start API server using npx to ensure tsx is available
const api = spawn('npx', ['tsx', 'api/index.ts'], {
  cwd: __dirname,
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

api.on('close', (code) => {
  process.exit(code);
});

process.on('SIGINT', () => {
  api.kill();
  process.exit();
});