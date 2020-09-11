#!/usr/bin/env node

const pkg = require('../package.json');
const args = require('minimist')(process.argv.slice(2));

if (!args._.length) {
  console.log(`Single-SPA BoilerPlate (ssbp) cli tool version: ${pkg.version}`);
}
else {
  let command;
  command = args._[0];
  switch (command) {
    case 'new':
      require('./new/index.js');
      break;

    case 'install':
      require('./install');
      break;

    default:
      throw new Error(`ERROR: Unknown command ${command}`);
  }
}
