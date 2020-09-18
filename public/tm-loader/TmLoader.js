import { QueueLoader } from './queue-loader/QueueLoader.js';

const cache = {
  full: {},
  short: {},
};

/**
 * TmLoader
 */
export class TmLoader {
  static add ({ item, mod, state }) {
    let list, short;

    // Parse out the short name of the file.
    if (mod) {
      list = item.url.split('/');
      short = list[(list.length - 1)];
      short = short.split('.')[0];

      // Cache the module.
      item = {
        url: item.url,
        mod,
      };
      cache.full[item.url] = item;
      cache.short[short] = item;
    }

    if (state) {
      QueueLoader.increment({ item, state });
      if (state.log) {
        console.log('cache:', cache);
      }
    }
  }

  static define (args) {
    args.mod = args.mod;
    TmLoader.add (args);
  }

  static find (short = '', full = '') {
    let item;

    name = short;
    item = cache.short[name];
    if (full) {
      name = full;
      item = cache.full[name];
    }
    if (item) { return item.mod; }
    throw new Error(`ERROR: The TmLoader module '${name}' was not found.`);
  }

  static load (queue) {
    QueueLoader.start ({ state: queue });
  }

  static setup (config) {
    this.setup = undefined;
    let base;

    base = `/cdn/proxy`;
    TmLoader.load ({
      list: [
        { module: false, url: `${base}/cdnjs/acorn/8.0.1/acorn.min.js` },
        { module: false, url: `${base}/cdnjs/voca/1.4.0/voca.min.js` },
      ],
      log: config.log,
      name: 'Tamed Loader Dependencies',
      // module: './ssbp/Ssbp.js',
      done: () => {
        // Setup TamedJs Loader.

        // Bootup the app.
        TmLoader.load (config);
      }
    });
  }
}

// if (args.item.url.indexOf('single-spa') > -1) {
//   // UMD Loading?
//   let umd = {};
//   args.mod(umd);
//   args.mod = umd;
//   import('https://cdnjs.cloudflare.com/ajax/libs/single-spa/5.5.5/esm/single-spa.min.js').then((mod) => {
//     console.log('MOD:', mod);
//   })
// }
// else if (args.item.url.indexOf('uikit') > -1) {
//   console.log('*** here:', args.mod ());
//   args.mod = args.mod();
// }
// else {
//   // AMD Loading?
//   args.mod = args.mod(window);
// }
// console.log(args.item.url, args.mod);
