#!/usr/bin/env node

const { DevCommand } = require('../dist/commands/dev');
const { loadConfig } = require('../dist/utils/config');
const path = require('path');

async function startDevServer() {
  try {
    console.log('🚀 Starting development server...');
    
    // Load configuration
    const configPath = path.join(process.cwd(), 'blog.config.js');
    let config = {};
    try {
      // loadConfig 会自动从项目根目录读取并在缺失时回退到默认
      config = await loadConfig(configPath);
    } catch (error) {
      console.log('⚠️  No config file found, using defaults');
    }
    
    // Create dev command instance and start
    const dev = new DevCommand(config);
    await dev.execute({
      port: config.dev?.port || 3000,
      host: config.dev?.host || 'localhost',
      open: config.dev?.open ?? true,
    });
    
    console.log(`✅ Development server started successfully!`);
    console.log(`🌐 Server running at http://${config.dev?.host || 'localhost'}:${config.dev?.port || 3000}`);
    console.log(`📁 Posts directory: ${config.postsDir || 'posts'}`);
    console.log(`🔄 Hot reload: ${config.dev?.hot !== false ? 'enabled' : 'disabled'}`);
    
  } catch (error) {
    console.error('❌ Failed to start development server:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startDevServer();
}

module.exports = { startDevServer };