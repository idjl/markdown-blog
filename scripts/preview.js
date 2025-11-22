#!/usr/bin/env node

const express = require('express');
const path = require('path');
const { loadConfig } = require('../dist/utils/config');

async function startPreviewServer() {
  try {
    console.log('🚀 Starting preview server...');
    
    // Load configuration
    const configPath = path.join(process.cwd(), 'blog.config.js');
    let config = {};
    
    try {
      config = await loadConfig(configPath);
    } catch (error) {
      console.log('⚠️  No config file found, using defaults');
    }
    
    const app = express();
    const port = config.preview?.port || 4000;
    const host = config.preview?.host || '0.0.0.0';
    const outputDir = config.outputDir || 'dist';
    
    // Serve static files from the output directory
    app.use(express.static(outputDir));
    
    // Handle SPA routing - fallback to index.html for client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), outputDir, 'index.html'));
    });
    
    // Start the server
    app.listen(port, host, () => {
      console.log(`✅ Preview server started successfully!`);
      console.log(`🌐 Preview server running at http://${host}:${port}`);
      console.log(`📁 Serving files from: ${outputDir}`);
      console.log('');
      console.log('💡 This server serves the built static files from the dist directory.');
      console.log('💡 Make sure to run "npm run build" first to generate the static files.');
    });
    
  } catch (error) {
    console.error('❌ Failed to start preview server:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startPreviewServer();
}

module.exports = { startPreviewServer };