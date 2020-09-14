const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
const { resolve, sep } = require('path');
const pkg = require('./package.json');

const webpack = require('webpack');

// Set the ouput of the static files to the root app.
let name = pkg.name;
if (name.indexOf('/') > -1) {
  name = name.replace('@', '').split('/').join(sep);
}
// const dest = resolve('..', 'root-app', 'public', 'static', name);
const dest = resolve('dist', name);
console.log('STATIC OUTPUT:', dest);

module.exports = (angularWebpackConfig, options) => {
  let config;

  config = angularWebpackConfig;

  angularWebpackConfig.devServer.writeToDisk = true;

  let bob = singleSpaAngularWebpack(angularWebpackConfig, options);
  bob.output.path = dest;
  bob.devServer.writeToDisk = true;

  // const compiler = webpack(bob);

  // // `compiler.run()` doesn't support promises yet, only callbacks
  // new Promise((resolve, reject) => {



  //   compiler.run((err, res) => {
  //     if (err) {
  //       return reject(err);
  //     }
  //     console.log('\n\n******* cooool *******\n\n');
  //     resolve(res);
  //   });
  // });


  return config;

  // if (process.env.SPA_DEVMODE === 'dev') {
  //   config = angularWebpackConfig;
  //   config.entry.main[0] = config.entry.main[0].replace('main.single-spa.ts', 'main.ts');
  //   return config;
  // }

  // // Feel free to modify this webpack config however you'd like to
  // config = singleSpaAngularWebpack(angularWebpackConfig, options);
  // config.output.path = dest;
  // return config;
};
