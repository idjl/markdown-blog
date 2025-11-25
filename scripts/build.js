#!/usr/bin/env node

const { StaticGenerator } = require('../dist/core/static-generator');
const { loadConfig } = require('../dist/utils/config');
const path = require('path');
const fs = require('fs').promises;

async function build() {
  try {
    console.log('🚀 Starting static site generation...');
    
    // Load configuration
    let config = {};
    
    try {
      config = await loadConfig();
    } catch (error) {
      console.log('⚠️  No config file found, using defaults');
    }
    
    // Ensure output directory exists
    const outputDir = (config.build && config.build.outputDir) || 'dist';
    await fs.mkdir(outputDir, { recursive: true });
    
    // Create generator instance
    const generator = new StaticGenerator(config);
    
    // Generate the static site
    const result = await generator.generate();
    
    console.log('✅ Static site generation completed successfully!');
    console.log(`📊 Generated ${result.posts.length} posts`);
    console.log(`📁 Created ${result.pages.length} pages`);
    console.log(`🏷️  Processed ${result.categories.length} categories and ${result.tags.length} tags`);
    console.log(`📡 Generated RSS feed: ${result.rss}`);
    console.log(`🗺️  Generated sitemap: ${result.sitemap}`);
    console.log(`📂 Output directory: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  build();
}

module.exports = { build };
