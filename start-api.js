#!/usr/bin/env node

// Direct API startup script for debugging
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting API server directly...');

const apiPath = path.join(__dirname, 'api');
console.log('API path:', apiPath);

// Start API with proper environment
const api = spawn('npx', ['tsx', 'index.ts'], {
  cwd: apiPath,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '5000'
  }
});

api.on('error', (err) => {
  console.error('Failed to start API:', err);
  process.exit(1);
});

api.on('exit', (code) => {
  console.log(`API exited with code ${code}`);
  process.exit(code);
});

process.on('SIGINT', () => {
  console.log('Stopping API...');
  api.kill();
});