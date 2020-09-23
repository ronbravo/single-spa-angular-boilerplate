const liveServer = require('live-server');
const pkg = require('./package.json');
const urlParser = require('url');
const fetch = require('node-fetch');


// (function (global, factory) {
//   if (typeof exports === 'object' && typeof module !== 'undefined') {
//     module.exports = factory()
//   }
//   else {
//     if (typeof define === 'function' && define.amd) {
//       define(factory)
//     }
//     else {
//       global.v = factory();
//     }
//   }
// })();




// if ("object" == typeof exports && "undefined" != typeof module) {
//   n(exports)
// }
// else if ("function" == typeof define && define.amd) {
//   define(["exports"], n)
// } else {
//   n((t = t || self).singleSpa = {})
// }

const options = {
  port: pkg.config.port,
  root: 'public',
  open: false,
  middleware: [
    (req, res, next) => {
      const url = urlParser.parse(req.url, true);
      let ext;

      ext = url.pathname.slice(url.pathname.lastIndexOf('.') + 1);
      if (ext === 'js' && url.pathname.indexOf('/cdn/proxy/') === 0) {
        let base, list, pathname, target;

        list = url.pathname.split('/');
        target = list[3];
        switch (target) {
          case 'cdnjs':
            base = `https://cdnjs.cloudflare.com/ajax/libs`;
            break;

          case 'jsdelivr':
            base = `https://cdn.jsdelivr.net/npm`;
            break;

          case 'unpkg':
            base = `https://unpkg.com`;
            break;
        }
        target = url.pathname.replace(`/cdn/proxy/${target}`, '');
        target = `${base}${target}`;
        console.log('- PROXY CDN:', target);

        fetch(target)
          .then(res => res.text())
          .then((body) => {
            let index;

            index = body.lastIndexOf('//# ');
            body = body.slice(0, index);

body = `(function () {
  const require = function (key) {
    if (window.tml) {
      return window.tml.require (key);
    }
    else {
      throw new Error ('The TmLoader has not been setup.');
    }
  }
  require.amd = true;

  const define = function (key, factory) {
    if (window.tml) {
      if (factory === undefined) {
        factory = key;
      }
      // console.log ('WHAT:', [].slice.call (arguments));
      window.tml.set ({ item: { url: '${url.pathname}' }, mod: factory });
    }
    else {
      throw new Error ('The TmLoader has not been setup.');
    }
  }
  define.amd = true;
  ${body}
})();`
            res.end(body);
            // res.body = 'bobby';
            // res.send();
            // console.log('WHAT:', res);
            // next();
          })
          .catch((err) => {
            console.error(`ERROR: ${err.message}`);
            next();
          })
      }
      else {
        next();
      }
    }
  ]
}
liveServer.start(options);

// var params = {
//   port: 8181, // Set the server port. Defaults to 8080.
//   host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
//   root: "/public", // Set root directory that's being served. Defaults to cwd.
//   open: false, // When false, it won't load your browser by default.
//   ignore: 'scss,my/templates', // comma-separated string for paths to ignore
//   file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
//   wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
//   mount: [['/components', './node_modules']], // Mount a directory to a route.
//   logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
//   middleware: [function (req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
// };
// liveServer.start(params);
