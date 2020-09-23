import { QueueLoader } from './queue-loader/QueueLoader.js';

const cache = {
  count: {
    full: 0,
    short: 0,
  },
  full: {},
  short: {},
};

const queue = [];
const done = [];

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
    target = cache.full[item.url];
    if (!target) {
      target = item;
      cache.full [item.url] = target;
      if (!target.aliases) { target.aliases = []; }
      cache.count.full++;
    }

    // Cache by alias
    if (!cache.short[item.short]) {
      target.aliases.push(item.short);
      cache.short[item.short] = target;
      cache.count.short++;
    }

    if (state) {
      QueueLoader.increment({ item, state });
      if (state.log) {
        console.log('cache:', cache);
      }
    }
  }

  static done ({ cb, item, state }) {
    let found;


    found = TmLoader.find (null, item.url, true);
    console.log ('FOUND:', found);
    // // console.log ('CACHE:', cache);
    //
    // if (found) {
    //   // console.log ('ITEM:', item);
    //   // console.log ('STATE:', state);
    //   found.done = true;
    //   done.push (item.url);
    //   // console.log ('WHAT:', done.length);
    // }

    // queue.push (cb);
    // // console.log ('STATE:', state);
    // // console.log ('CACHE:', cache);
    // Object.keys (cache.full).forEach ((key) => {
    //   let item;
    //   item = cache.full [key];
    //   console.log ('ITEM:', item);
    // });
  }

  static define (key, factory) {
    if (factory === undefined) {
      factory = key;
      key = `unknown-${Date.now ()}.js`;
    }

    // console.log('WHAT:', [].slice.call(arguments));
    window.tml.set ({ item: { url: key }, mod: factory });
    console.log ('CACHE:', cache);
  }

  static set (args) {
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

  static find (short = '', full = '', fullItem = false) {
    let item;

    name = short;
    item = cache.short[name];
    if (full) {
      name = full;
      item = cache.full[name];
    }

    if (item && !fullItem) { return item.mod; }
    else { return item; }

    throw new Error(`ERROR: The TmLoader module '${name}' was not found.`);
  }

  static import (path, scope) {
    let mod;
    try {
      mod = TmLoader.find(path);
    }
    catch (err) {
      if (path === '@project/player') {
        console.log('TODO: Load the module. Try and use maps...');
      }
      console.log('scope:', scope);
      console.warn(err);
    }
    return { Player: 'mario', Health: 45 };
  }

  static load (queue) {
    QueueLoader.start ({ state: queue });
  }

  static require(name) { return TmLoader.find(name); }

  static setup (config) {
    this.setup = undefined;
    let base;

    // // TODO: Place console in it's own area.
    // let orig = window.console.log;
    // let log = function () {
    //   let args = [].slice.call (arguments);
    //   orig.apply (window, args);
    // }
    //
    // window.console.log = log;
    // // window.error = log;

    // if (!window.tml) {
    //   Object.defineProperty (window, 'tml', {
    //     value: TmLoader,
    //   });
    // }

    Object.defineProperty (window, 'require', {
      value: TmLoader.require,
    });

    Object.defineProperty (window, 'define', {
      value: TmLoader.define,
    });

    Object.defineProperty (window.define, 'amd', {
      value: true,
    });


    base = `/cdn/proxy`;
    TmLoader.load ({
      log: config.log,
      name: 'Tamed Loader Dependencies',
      // module: './ssbp/Ssbp.js',
      import: {
        list: [
          { module: false, url: `${base}/cdnjs/acorn/8.0.1/acorn.min.js` },
          { module: false, url: `${base}/jsdelivr/jsonpath-plus@4.0.0/dist/index-umd.min.js`, alias: 'json-path' },
          { module: false, url: `${base}/cdnjs/voca/1.4.0/voca.min.js`, alias: 'bob' },
          // { module: false, url: `${base}/cdnjs/uikit/3.5.7/js/uikit.min.js` },
          // { module: false, url: `${base}/jsdelivr/slugify@1.4.5/slugify.min.js` },
        ],
      },
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

Object.defineProperty (window, 'tml', {
  value: TmLoader,
});

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
