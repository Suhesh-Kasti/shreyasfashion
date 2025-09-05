#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Sanity Studio Dependencies...\n');

const studioDir = path.join(__dirname, 'studio');

if (!fs.existsSync(studioDir)) {
  console.error('❌ Studio directory not found!');
  process.exit(1);
}

try {
  console.log('🧹 Cleaning node_modules and package-lock.json...');
  
  // Remove node_modules and package-lock.json
  const nodeModulesPath = path.join(studioDir, 'node_modules');
  const packageLockPath = path.join(studioDir, 'package-lock.json');
  
  if (fs.existsSync(nodeModulesPath)) {
    execSync(`rm -rf "${nodeModulesPath}"`, { stdio: 'inherit' });
  }
  
  if (fs.existsSync(packageLockPath)) {
    fs.unlinkSync(packageLockPath);
  }

  console.log('📦 Installing dependencies with legacy peer deps...');
  
  // Install with legacy peer deps to avoid conflicts
  execSync('npm install --legacy-peer-deps', { 
    cwd: studioDir, 
    stdio: 'inherit' 
  });

  console.log('\n✅ Studio dependencies fixed!');
  console.log('\n🚀 You can now run:');
  console.log('cd studio && npm run dev');
  console.log('\nOr from root directory:');
  console.log('npm run studio:dev');

} catch (error) {
  console.error('❌ Fix failed:', error.message);
  console.log('\n🔧 Manual fix steps:');
  console.log('1. cd studio');
  console.log('2. rm -rf node_modules package-lock.json');
  console.log('3. npm install --legacy-peer-deps');
  process.exit(1);
}
