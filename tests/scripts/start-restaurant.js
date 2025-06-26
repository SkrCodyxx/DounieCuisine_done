#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Dounie Cuisine Restaurant Management System - Starting API Server');

// Ensure API has access to dependencies by running from project root
const api = spawn('node', [
  '--loader', 'tsx/esm',
  'api/index.ts'
], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: false,
  env: { 
    ...process.env, 
    NODE_ENV: 'development',
    PORT: '5000'
  }
});

api.on('error', (err) => {
  console.error('Failed to start API server:', err.message);
  process.exit(1);
});

api.on('close', (code) => {
  console.log(`API server process ended with code ${code}`);
  process.exit(code);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down restaurant management system...');
  api.kill('SIGINT');
});

process.on('SIGTERM', () => {
  api.kill('SIGTERM');
});