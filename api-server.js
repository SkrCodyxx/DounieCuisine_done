const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Dounie Cuisine API Server...');

// Start API server using npx with explicit path
const api = spawn('npx', ['--yes', 'tsx', 'index.ts'], {
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

api.on('close', (code) => {
  console.log(`API server exited with code ${code}`);
  process.exit(code);
});

process.on('SIGINT', () => {
  console.log('Shutting down API server...');
  api.kill('SIGINT');
});

process.on('SIGTERM', () => {
  api.kill('SIGTERM');
});