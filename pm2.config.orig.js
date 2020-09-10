const { resolve } = require('path');
const homedir = require('os').homedir();

// NOTE: Replace this path with your projects are.
const workspace = resolve(homedir, 'workspace', 'dev');

module.exports = {
  apps: [
    // {
    //   namespace: 'sample-proj',     // a group name for related apps
    //   name: 'sp-dev',               // app / service name
    //   cwd: `${workspace}/dev/cli`,  // directory to start app from
    //   script: 'npm',                // The script start command
    //   args: 'run dev',              // params to give the command
    // },
  ]
}
