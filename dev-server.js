const fs = require('fs-extra');
const liveServer = require('live-server');
const pkg = require('./package.json');

fs.ensureDir('dist', (err) => {
  if (err) {
    console.error(`ERROR: Unable to run server. Issue with the 'dist' directory.`)
  }

  const params = {
    port: pkg.config.port,
    cors: true,
    root: './dist',
    open: false,
    wait: 1000,
    logLevel: 1,
  };
  liveServer.start(params);
});
