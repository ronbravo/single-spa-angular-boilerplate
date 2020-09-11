const fs = require('fs-extra');
const { spawn } = require('child_process');
const { resolve } = require('path');
const deepmerge = require('deepmerge');

function getRepoBranch(type) {
  let branch;

  switch (type) {
    case 'angular-5':
      branch = 'sample-angular-v5-app';
      break;

    case 'angular-10':
      branch = 'sample-angular-v10-app';
      break;

    case 'root':
      branch = 'root-app';
      break;

    default:
      branch = '';
  }

  return branch;
}

function newApp(config) {
  let commands, branch;

  fs.ensureDir('app', (err) => {
    if (err) {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
      return;
    }

    branch = getRepoBranch(config.type);
    if (branch) {
      config = deepmerge({
        alias: config.app,
        key: branch,
        prefix: 'release',
        repo: 'git@github.com:ronbravo/single-spa-boilerplate.git',
      }, config);

      commands = [
        `cd app`,
        `git clone -b ${config.prefix}/${config.key} ${config.repo} ${config.alias}`,
        `cd ${config.alias}`,
        `git checkout -b develop`,
      ].join(' && ');

      console.log ('command:', commands);
      const child = spawn(commands, { shell: true, stdio: 'inherit' });
      child.on('exit', function (code, signal) {
        console.log(`- DONE: ${config.app}`);
      });
    }
    else {
      console.error(`ERROR: Invalid type - ${config.type}`)
    }
  })
}

module.exports.app = function (config) {
  newApp(config);
}
