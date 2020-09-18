import {
  CssLoader,
  JsLoader,
} from './loader/index.js';

const CSS    = 'css';
const JS     = 'js';
const JSON5  = 'json5';

export class ResolveType {
  static getExtension({ item }) {
    let ext, index, list;

    ext = '';
    index = item.url.lastIndexOf('.');
    if (index > -1) {
      list = item.url.split('.');
      ext = list[(list.length - 1)];
      return ext;
    }
    return ext;
  }

  static load ({ item, state }) {
    switch (item.ext) {
      case CSS:
        CssLoader.load({ item, state });
        break;

      case JS:
        JsLoader.load({ item, state });
        break;

      default:
        break;
    }
  }
}
