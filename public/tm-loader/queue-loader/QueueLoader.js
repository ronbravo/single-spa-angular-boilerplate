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
    }

    item = info;
    item.short = QueueLoader.getShortName({ item });
    item.ext = ResolveType.getExtension({ item });
    return item;
  }

  static done({ state }) {
    if (state.log) { console.log(`Done loading - ${state.name}`); console.log(''); }
    if (state.module) {
      JsLoader.loadModule({ state });
    } else if (state.done) {
      state.done();
    }
  }

  static getShortName({ item }) {
    let index, list, short, url;

    // Parse out the short name of the file.
    url = item.url;
    index = url.lastIndexOf('?');
    if (index > -1) {
      item.base = url.slice(0, index);
      item.query = url.slice(index);
      item.url = item.base;
    }

    if (item.base === undefined) { item.base = item.url; }
    if (item.query === undefined) { item.query = ''; }

    short = item.alias;
    if (!short) {
      list = item.url.split('/');
      short = list[(list.length - 1)];
      short = short.split('.')[0];
    }
    return short;
  }

  static increment({ item, state }) {
    if (state.log) { console.log('Loaded:', item); }
    state.count++;
    if (state.count >= state.import.list.length) {
      QueueLoader.done({ state });
    }
  }

  static load ({ item, state }) {
    item = QueueLoader.asQueueItem ({ item });
    ResolveType.load ({ item, state })
  }

  static start ({ state }) {
    state.count = 0;
    if (!state.name) { state.name = `tm-loader-queue-${Date.now()}`; }
    
    state.import.list.forEach ((item) => {
      QueueLoader.load ({ item, state });
    });
  }
}
