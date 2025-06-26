const { spawn } = require('child_process');
const path = require('path');

// Start API server with proper environment setup
const api = spawn('npx', ['tsx', 'index.ts'], {
  cwd: path.join(__dirname, 'api'),
  stdio: 'inherit',
  shell: false,
  env: { 
    ...process.env, 
    NODE_ENV: 'development',
    PORT: '5000',
    NODE_PATH: path.join(__dirname, 'node_modules') + ':' + path.join(__dirname, 'api', 'node_modules')
  }
});

console.log('Starting Dounie Cuisine API Server on port 5000...');

api.on('error', (err) => {
  console.error('API startup error:', err.message);
});

api.on('close', (code) => {
  console.log(`API server exited with code ${code}`);
  process.exit(code);
});

process.on('SIGINT', () => {
  console.log('Shutting down API server...');
  api.kill('SIGINT');
  setTimeout(() => process.exit(0), 1000);
});

process.on('SIGTERM', () => {
  api.kill('SIGTERM');
  setTimeout(() => process.exit(0), 1000);
});