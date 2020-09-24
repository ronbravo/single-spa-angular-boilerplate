import { QueueLoader } from './queue-loader/QueueLoader.js';

const cache = {
  count: {
    full: 0,
    alias: 0,
  },
  full: {},
  alias: {},
  callbacks: [],
  done: [],
};

// const queue = [];
// const doneList = [];
// const callbackList = [];

/**
 * TmLoader
 */
export class TmLoader {
  static add ({ item, mod, state }) {
    let list, alias, target;

    // Parse out the alias name of the file.
    // if (mod !== undefined) { item.mod = mod; }

    // Get the alias name.
    list = item.url.split('/');
    alias = item.alias;
    if (!alias) {
      alias = list [(list.length - 1)];
      alias = alias.split('.')[0];
    }

    // Cache the module.
    // item.mod = mod;
    target = cache.full [item.url];
    if (!target) {
      target = item;
      cache.full [item.url] = target;
      if (!target.aliases) { target.aliases = []; }
      cache.count.full++;
    }

    // Cache by alias
    if (item.mod && !target.mod) { target.mod = item.mod; }
    if (!cache.alias [item.alias]) {
      target.aliases.push (item.alias);
      cache.alias [item.alias] = target;
      cache.count.alias++;
    }

    if (state) {
      QueueLoader.increment ({ item, state });
      if (state.log) {
        console.log('cache:', cache);
      }
    }
  }

  static done ({ complete, item, state }) {
    let end, found, i, key, list, mod, ready;

    found = TmLoader.find (null, item.url, true);

    if (found) {
      // if (found.module === false) { found.done = true; }
      found.done = true;
      cache.done.push (item.url);
      // cache.callbacks.push ({ mod: found, complete });

      if (state.count >= state.import.list.length) {
        if (cache.done.length >= cache.count.full) {
          console.log ('HERE NOW', cache.done.length, cache.count.full, state.count, state.import.list.length);
          cache.callbacks.push ({ mod: found, complete });

          ready = true;
          list = Object.keys (cache.full);
          end = list.length;
          for (i = 0; i < end; i++) {
            key = list[i];
            mod = cache.full [key];
            if (!mod.done) {
              ready = false;
              break;
            }
          }

          if (ready) {
            cache.callbacks.forEach ((callback) => {
              // setTimeout(() => {
                callback.complete ();
                if (state.log) {
                  console.log ('ITEM:', mod);
                  console.log ('MODULE DONE:', callback.mod);
                }
              // }, 1000);
            });
            cache.callbacks = [];
          }
        }
      }
    }
    else {
      console.log ('ERROR:', item, state);
      throw new Error (`Cache item not found because it was not properly set: ${item.url}`);
    }

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
  }

  static set (args) {
    let { item, mod } = args;
    let context, found, result;

    context = {};
    result = mod (context);
    mod = context;
    if (result) {
      mod = result;
    }

    found = TmLoader.find(null, item.url, true);
    if (found) { item = found; }

    item = QueueLoader.asQueueItem ({ item });
    item.mod = mod;
    TmLoader.add ({ item });
  }

  static find (alias = '', full = '', fullItem = false) {
    let item;

    name = alias;
    item = cache.alias [name];
    if (full) {
      name = full;
      item = cache.full [name];
    }

    if (item && !fullItem) { return item.mod; }
    else { return item; }

    throw new Error (`ERROR: The TmLoader module '${name}' was not found.`);
  }

  static import (path, scope) {
    let item;
    try {
      item = TmLoader.find(path, null, true);
      console.log('MODULE:', path, item, Object.keys(cache.alias));

      if (item && item.mod) {
        return item.mod;
      }
      // if (item) {
      //   console.log('NO:', path, item.mod);
      // }
      return { Player: 'mario', Health: 45 };
    }
    catch (err) {
      // if (path === '@project/player') {
      //   console.log('TODO: Load the module. Try and use maps...');
      // }
      // console.log('HFASDFAS???/')
      // TmLoader.load ({
      //   import: {
      //     list: [
      //       {
      //         module: false,
      //         url: `/public/tm-loader/_info/test/sample/game/player/Player.js`, alias: path
      //       },
      //     ],
      //   },
      // });

      console.log('scope:', scope);
      console.warn(err);
      return { Player: 'mario', Health: 45 };
    }
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
        console.log ('CACHE:', cache);
        // console.log ('CONFIG:', config);
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
