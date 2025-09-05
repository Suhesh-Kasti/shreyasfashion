#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Shreya\'s Fashion Studio...\n');

// Check if studio directory exists
const studioDir = path.join(__dirname, 'studio');
if (!fs.existsSync(studioDir)) {
  console.error('❌ Studio directory not found!');
  process.exit(1);
}

try {
  // Install studio dependencies
  console.log('📦 Installing studio dependencies...');
  execSync('npm install', { 
    cwd: studioDir, 
    stdio: 'inherit' 
  });

  console.log('\n✅ Studio setup complete!');
  console.log('\n🎯 Next steps:');
  console.log('1. Deploy your studio to Vercel (see SANITY_STUDIO_DEPLOYMENT_GUIDE.md)');
  console.log('2. Add your first products and categories');
  console.log('3. Start managing your fashion store content!');
  console.log('\n🔧 Available commands:');
  console.log('- npm run studio:dev    # Run studio locally');
  console.log('- npm run studio:build  # Build studio for production');
  console.log('- npm run studio:deploy # Deploy studio to Sanity hosting');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
