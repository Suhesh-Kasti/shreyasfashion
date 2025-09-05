#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Sanity Studio Draft ID Error...\n');

try {
  console.log('🧹 Clearing Sanity cache...');
  
  // Clear Sanity cache directories
  const cacheDirectories = [
    '.sanity',
    'node_modules/.sanity',
    'node_modules/.cache'
  ];
  
  cacheDirectories.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
      console.log(`   Removing ${dir}...`);
      execSync(`rm -rf "${fullPath}"`, { stdio: 'inherit' });
    }
  });

  console.log('\n📦 Reinstalling dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

  console.log('\n🚀 Starting studio...');
  console.log('Studio will be available at: http://localhost:3333\n');
  
  execSync('npm run dev', { stdio: 'inherit' });

} catch (error) {
  console.error('❌ Fix failed:', error.message);
  console.log('\n🔧 Manual fix steps:');
  console.log('1. cd studio');
  console.log('2. rm -rf .sanity node_modules/.sanity node_modules/.cache');
  console.log('3. npm install --legacy-peer-deps');
  console.log('4. npm run dev');
  process.exit(1);
}
