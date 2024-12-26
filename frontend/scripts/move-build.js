const fs = require('fs-extra');
const path = require('path');

// Remove existing docs folder
fs.removeSync(path.join(__dirname, '../../docs'));

// Move build folder to docs
fs.moveSync(
  path.join(__dirname, '../build'),
  path.join(__dirname, '../../docs'),
  { overwrite: true }
);

console.log('Successfully moved build to docs folder!'); 