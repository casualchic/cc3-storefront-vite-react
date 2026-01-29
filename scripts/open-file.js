#!/usr/bin/env node

/**
 * Cross-platform file opener script
 * Opens a file using the system's default application
 *
 * Usage: node scripts/open-file.js <file-path>
 */

import { exec } from 'child_process';
import { platform } from 'os';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = process.argv[2];

if (!filePath) {
  console.error('Error: No file path provided');
  console.error('Usage: node scripts/open-file.js <file-path>');
  process.exit(1);
}

// Resolve relative path from project root
const absolutePath = resolve(process.cwd(), filePath);

// Determine the command based on platform
let command;
const os = platform();

switch (os) {
  case 'darwin': // macOS
    command = `open "${absolutePath}"`;
    break;
  case 'win32': // Windows
    command = `start "" "${absolutePath}"`;
    break;
  default: // Linux and other Unix-like systems
    command = `xdg-open "${absolutePath}"`;
    break;
}

console.log(`Opening ${absolutePath}...`);

exec(command, (error) => {
  if (error) {
    console.error(`Failed to open file: ${error.message}`);
    console.error(`Attempted command: ${command}`);
    console.error(`\nPlease open the file manually: ${absolutePath}`);
    process.exit(1);
  }
  console.log('File opened successfully');
});
