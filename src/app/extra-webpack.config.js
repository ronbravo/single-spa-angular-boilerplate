const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
const { resolve, sep } = require('path');
const pkg = require('./package.json');

// Set the ouput of the static files to the root app.
let name = pkg.name;
if (name.indexOf('/') > -1) {
  name = name.replace('@', '').split('/').join(sep);
}
const dest = resolve('..', 'root-app', 'public', 'static', name);
console.log('STATIC OUTPUT:', dest);

module.exports = (angularWebpackConfig, options) => {
  let config;

  if (process.env.SPA_DEVMODE === 'dev') {
    config = angularWebpackConfig;
    config.entry.main[0] = config.entry.main[0].replace('main.single-spa.ts', 'main.ts');
    
    if (config.devServer) {
      // config.devServer.writeToDisk = true;
    }    
    return config;
  }
  
  // Feel free to modify this webpack config however you'd like to
  config = singleSpaAngularWebpack(angularWebpackConfig, options);
  config.output.path = dest;
  return config;
};
