const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
const { resolve, sep } = require('path');
const pkg = require('./package.json');

const webpack = require('webpack');

// Set the ouput of the static files to the root app.
const dest = resolve('..', '..', 'public', 'static', pkg.config.org, pkg.config.name);
console.log('\nSTATIC OUTPUT:', dest, '\n');

module.exports = (angularWebpackConfig, options) => {
  let config, ssbp;

  config = angularWebpackConfig;
  config.watch = true;
  config.output.path = dest;
  config.devServer.writeToDisk = true;

  ssbp = singleSpaAngularWebpack(config, options);
  ssbp.watch = true;
  ssbp.output.path = dest;
  ssbp.output.filename = '[name].ssbp.js';
  ssbp.devServer.writeToDisk = true;


  // ssbp.externals.lodash = {
  //   commonjs: 'lodash',
  //   commonjs2: 'lodash',
  //   amd: 'lodash',
  //   root: '_',
  // };

  // Check if there are libraries we need to externalize.
  if (pkg.peerDependencies) {
    Object.keys(pkg.peerDependencies).forEach((key) => {
      ssbp.externals[key] = key;
    });
  }

  // ssbp.externals.uikit = {
  //   commonjs: 'uikit',
  //   commonjs2: 'uikit',
  //   amd: 'uikit',
  //   root: 'uikit',
  // };
  // ssbp.externals = ['zone.js', 'uikit'];
  // ssbp.externals.uikit = ['UiKit', 'Icons'];
  // console.log('EXTERNALS:', ssbp.externals);
  console.log('PEER DEPENDENCIES:', ssbp.externals);

  const compiler = webpack(ssbp);
  compiler.watch({
    aggregateTimeout: 300,
    poll: undefined
  }, (err, stats) => {
    if (err) { console.error (err); }
    // console.log(stats);
  });

  return config;
};
