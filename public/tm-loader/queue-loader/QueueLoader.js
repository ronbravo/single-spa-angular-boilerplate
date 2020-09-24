import { ResolveType } from './resolve-type/ResolveType.js';

/**
 * QueueLoader
 */
export class QueueLoader {
  static asQueueItem({ item }) {
    let info;
    if ((typeof item) === 'string') {
      info = { module: true, url: item }
    }
    else {
      info = Object.assign({ module: true }, item);
      if (item.module !== undefined) { info.module = item.module; }
    }

    item = info;
    item.alias = QueueLoader.getAliasName({ item });
    item.ext = ResolveType.getExtension({ item });
    return item;
  }

  static done({ state }) {
    if (state.log) {
      console.log (`Done loading - ${state.name}`);
      console.log ('');
    }

    if (state.module) {
      JsLoader.loadModule ({ state });
    }
    else if (state.done) {
      state.done ();
    }
  }

  static getAliasName({ item }) {
    let index, list, alias, url;

    // Parse out the alias name of the file.
    url = item.url;
    index = url.lastIndexOf('?');
    if (index > -1) {
      item.base = url.slice(0, index);
      item.query = url.slice(index);
      item.url = item.base;
    }

    if (item.base === undefined) { item.base = item.url; }
    if (item.query === undefined) { item.query = ''; }

    alias = item.alias;
    if (!alias) {
      list = item.url.split('/');
      alias = list[(list.length - 1)];
      alias = alias.split('.')[0];
    }
    return alias;
  }

  static increment({ item, state }) {
    if (state.log) { console.log('Loaded:', item); }
    state.count++;
    // if (state.count >= state.import.list.length) {
      tml.done ({
        complete: function () { QueueLoader.done ({ state }) },
        item,
        state
      });
      // QueueLoader.done({ state });
    // }
  }

  static load ({ item, state }) {
    item = QueueLoader.asQueueItem ({ item });
    tml.add ({ item });
    ResolveType.load ({ item, state })
  }

  static start ({ state }) {
    state.count = 0;

    if (!state.name) { state.name = `tm-loader-queue-${Date.now()}`; }
    if (state.import.list === undefined) { state.import.list = []; }

    state.import.list.forEach ((item) => {
      QueueLoader.load ({ item, state });
    });
  }
}
