const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Dounie Cuisine API Server...');

// Start just the API server with environment path
const api = spawn('node', ['--loader', 'tsx/esm', 'index.ts'], {
  cwd: path.join(__dirname, 'api'),
  stdio: 'inherit',
  shell: true,
  env: { 
    ...process.env, 
    NODE_ENV: 'development',
    PORT: '5000',
    NODE_PATH: path.join(__dirname, 'node_modules')
  }
});

api.on('error', (err) => {
  console.error('API failed to start:', err.message);
  process.exit(1);
});

process.on('SIGINT', () => {
  api.kill();
  process.exit();
});