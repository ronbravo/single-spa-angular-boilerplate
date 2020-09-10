// When the window has loaded.
window.addEventListener('load', function () {

  /**
   * LoaderQueue
   */
  class LoaderQueue {
    static done ({ state }) {
      if (state.log) { console.log(`Done loading - ${state.name}`); }
      if (state.module) { 
        LoaderQueue.loadModule({ state }); 
      } else if (state.done) { 
        state.done (); 
      }
    }

    static load ({ item, state }) {
      let dom, url;

      dom = document.createElement ('script');

      url = item;
      if (item.url) { url = item.url; }
      dom.src = url;

      if (item.type) { dom.type = item.type; }

      dom.onload = function () {
        if (Object.keys (exports).length) {
          TmLoader.add ({ file: item, mod: exports });
        }
        else if (Object.keys (module.exports).length) {
          TmLoader.add ({ file: item, mod: module.exports });
        }

        LoaderQueue.reset ();
        if (state.log) { console.log ('Loaded:', item); }
        state.count++;
        if (state.count >= state.list.length) {
          LoaderQueue.done ({ state });
        }
      }
      scriptDom.appendChild (dom);
    }

    static loadModule({ state }) {
      let dom;
      dom = document.createElement('script');
      dom.src = state.module;
      dom.type = 'module';
      dom.onload = function () {
        if (state.log) { console.log('Loaded module:', state.module); }
        if (state.done) {
          state.done();
        }
      }
      scriptDom.appendChild(dom);
    }

    static reset() {
      window.exports = {};
      window.module = {};
      module.exports = {};
    }

    static start ({ state }) {
      state.count = 0;
      if (!state.name) { state.name = `tm-loader-queue-${Date.now()}`; }

      LoaderQueue.reset();
      state.list.forEach((item) => {
        LoaderQueue.load({ item, state });
      });
    }
  }

  // TmLoader;
  let cache, id, queues, scriptDom;

  id = 'tm-loader-scripts';
  scriptDom = document.querySelector (`#${id}`);
  if (!scriptDom) {
    scriptDom = document.createElement ('div');
    scriptDom.id = 'tm-loader-scripts';
    document.body.appendChild (scriptDom);
  }

  cache = {
    full: {},
    short: {},
  };

  /**
   * TmLoader
   */
  class TmLoader {
    static add ({ file, mod }) {
      let item, list, short;

      // Parse out the short name of the file.
      list = file.split ('/');
      short = list [(list.length - 1)];
      short = short.split('.')[0];

      // Cache the module.
      item = {
        file,
        mod,
      };
      cache.full [file] = item;
      cache.short [short] = item;
    }

    static find (short = '', full = '') {
      let item;

      name = short;
      item = cache.short [name];
      if (full) {
        name = full;
        item = cache.full [name];
      }
      if (item) { return item.mod; }
      throw new Error(`ERROR: The TmLoader module '${name}' was not found.`);
    }

    static load (queue) {
      LoaderQueue.start({ state: queue });
    }
  }
  window.getTmLoader = function () { return TmLoader; }

  // Load the cached queues.
  if (window.$___tm_loader_temp_queues) {
    queues = window.$___tm_loader_temp_queues;
    delete window.$___tm_loader_temp_queues;

    if (queues) {
      queues.forEach ((queue) => {
        TmLoader.load (queue);
      });
    }
  }
});

// Set a list of items to load.
window.tmLoaderQueue = function (queue) {
  if (!window.getTmLoader) {
    if (!window.$___tm_loader_temp_queues) { window.$___tm_loader_temp_queues = []; }
    window.$___tm_loader_temp_queues.push (queue);
  }
  else {
    window.getTmLoader ().load (queue);
  }
}