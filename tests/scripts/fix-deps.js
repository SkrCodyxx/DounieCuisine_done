const fs = require('fs');
const path = require('path');

// Create complete node_modules symlink for each app
function setupDependencies() {
  const rootNodeModules = path.join(__dirname, 'node_modules');
  
  const apps = ['api', 'public', 'administration'];
  
  apps.forEach(app => {
    const appDir = path.join(__dirname, app);
    const appNodeModules = path.join(appDir, 'node_modules');
    
    // Remove existing node_modules if it exists
    if (fs.existsSync(appNodeModules)) {
      fs.rmSync(appNodeModules, { recursive: true, force: true });
    }
    
    // Create symlink to root node_modules
    try {
      fs.symlinkSync(rootNodeModules, appNodeModules, 'dir');
      console.log(`Linked node_modules to ${app}`);
    } catch (err) {
      console.warn(`Failed to link node_modules to ${app}:`, err.message);
    }
  });
}

setupDependencies();
console.log('Dependencies setup complete');