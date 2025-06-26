const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Dounie Cuisine Restaurant Management System');

// Start API server
const api = spawn('npx', ['tsx', 'index.ts'], {
  cwd: path.join(__dirname, 'api'),
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true,
  env: { 
    ...process.env, 
    NODE_ENV: 'development',
    PORT: '5000'
  }
});

api.stdout.on('data', (data) => {
  console.log(`[API] ${data.toString().trim()}`);
});

api.stderr.on('data', (data) => {
  console.error(`[API ERROR] ${data.toString().trim()}`);
});

// Start frontend apps after API initializes
setTimeout(() => {
  // Start public app
  const publicApp = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'public'),
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true
  });

  publicApp.stdout.on('data', (data) => {
    console.log(`[PUBLIC] ${data.toString().trim()}`);
  });

  publicApp.stderr.on('data', (data) => {
    console.error(`[PUBLIC] ${data.toString().trim()}`);
  });

  // Start admin app
  const adminApp = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'administration'),
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true
  });

  adminApp.stdout.on('data', (data) => {
    console.log(`[ADMIN] ${data.toString().trim()}`);
  });

  adminApp.stderr.on('data', (data) => {
    console.error(`[ADMIN] ${data.toString().trim()}`);
  });

  console.log('All services starting:');
  console.log('- API: http://localhost:5000');
  console.log('- Public: http://localhost:3000');
  console.log('- Admin: http://localhost:3001');

  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('Shutting down all services...');
    api.kill();
    publicApp.kill();
    adminApp.kill();
    process.exit();
  });
}, 3000);

api.on('error', (err) => {
  console.error('Failed to start API:', err.message);
  process.exit(1);
});