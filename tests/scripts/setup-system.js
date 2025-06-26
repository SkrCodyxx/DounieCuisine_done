#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Setting up Dounie Cuisine Restaurant Management System...');

// Copy dependencies from root to subdirectories
function copyDependencies() {
  const fs = require('fs');
  const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Create package.json for each app if it doesn't exist or needs updating
  const apps = ['api', 'public', 'administration'];
  
  apps.forEach(app => {
    const appPath = path.join(__dirname, app);
    const packagePath = path.join(appPath, 'package.json');
    
    if (fs.existsSync(packagePath)) {
      try {
        const appPackage = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        console.log(`${app} package.json exists with dependencies`);
      } catch (err) {
        console.error(`Error reading ${app} package.json:`, err.message);
      }
    }
  });
}

copyDependencies();

// Start API server directly
console.log('Starting API server...');
const api = spawn('npx', ['tsx', 'index.ts'], {
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
  console.log('Shutting down...');
  api.kill();
  process.exit();
});