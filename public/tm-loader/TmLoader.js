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
    let list, short, target;

    // Parse out the short name of the file.
    if (item.mod) { mod = item.mod; }

    // Get the short name.
    list = item.url.split('/');
    short = item.alias;
    if (!short) {
      short = list[(list.length - 1)];
      short = short.split('.')[0];
    }

    // Cache the module.
    item.mod = mod;
    if (!cache.full[item.url]) {
      cache.full[item.url] = item;
    }

    // Cache by alias
    target = cache.full[item.url];
    if (!cache.short[item.short]) {
      cache.short[item.short] = target;
    }

    if (state) {
      QueueLoader.increment({ item, state });
      if (state.log) {
        console.log('cache:', cache);
      }
    }
  }

  static define (args) {
    let { item, mod } = args;
    let context, result;

    context = {};
    result = mod (context);
    mod = context;
    if (result) {
      mod = result;
    }
    item = QueueLoader.asQueueItem({ item });

    TmLoader.add ({ item, mod });
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

  static import () { return { Player: 'mario', Health: 45 }; }

  static load (queue) {
    QueueLoader.start ({ state: queue });
  }

  static require(name) { return TmLoader.find(name); }

  static setup (config) {
    this.setup = undefined;
    let base;

    base = `/cdn/proxy`;
    TmLoader.load ({
      list: [
        { module: false, url: `${base}/cdnjs/acorn/8.0.1/acorn.min.js` },
        { module: false, url: `${base}/jsdelivr/jsonpath-plus@4.0.0/dist/index-umd.min.js`, alias: 'json-path' },
        { module: false, url: `${base}/cdnjs/voca/1.4.0/voca.min.js`, alias: 'bob' },
        // { module: false, url: `${base}/cdnjs/uikit/3.5.7/js/uikit.min.js` },
        // { module: false, url: `${base}/jsdelivr/slugify@1.4.5/slugify.min.js` },
      ],
      log: config.log,
      name: 'Tamed Loader Dependencies',
      // module: './ssbp/Ssbp.js',
      done: () => {
        // Setup TamedJs Loader.
        // console.log (tml.require ('voca').slugify('some sample 232 @#$ url'));
        // console.log (tml.require ('bob').slugify('some sample 232 @#$ url'));
        // console.log (tml.require ('acorn').parse('let bob = "car";'));
        // console.log (tml.require ('uikit').notification('hi'));
        // console.log (tml.require ('slugify')('coo dfsa 2#@# 443l43$$$'));

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
