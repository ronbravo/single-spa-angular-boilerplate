const fs = require('fs-extra');
const { spawn } = require('child_process');
const { resolve } = require('path');
const deepmerge = require('deepmerge');

function newProject(config) {
  let commands;

  config = deepmerge({
    alias: config.project,
    key: 'sample-project',
    prefix: 'release',
    repo: 'git@github.com:ronbravo/single-spa-boilerplate.git',
  }, config);

  commands = [
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

module.exports.app = function (config) {
  newProject(config);
}
