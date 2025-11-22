#!/usr/bin/env node

import { CLI } from '../src/commands/index.js';

const cli = new CLI();
cli.run().catch((error) => {
  console.error('CLI failed:', error);
  process.exit(1);
});