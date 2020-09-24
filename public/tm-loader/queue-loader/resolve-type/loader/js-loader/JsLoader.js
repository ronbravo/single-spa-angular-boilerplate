import { JsmLoader } from '../jsm-loader/JsmLoader.js';

export class JsLoader {
  static load ({ item, state }) {
    let dom;

    dom = document.createElement('script');
    dom.src = `${item.url}${item.query}`;
    if (item.type) { dom.type = item.type; }

    // Load the script.
    if (!item.module) {
      // Load and AMD module.
      dom.onload = () => { tml.add({ item, state }); }
      JsLoader.getParentDom ().appendChild (dom);
    }
    else {
      // Load and ESM module.
      JsmLoader.load ({ item, state });
    }
  }

  static getParentDom () {
    let dom, id;

    id = 'tm-loader-scripts';
    dom = document.querySelector (`#${id}`);
    if (!dom) {
      dom = document.createElement ('div');
      dom.id = id;
      document.body.appendChild (dom);
    }
    return dom;
  }
}



// static loadModule ({ parentDom, state }) {
//   let dom;
//   dom = document.createElement ('script');
//   dom.src = state.module;
//   dom.type = 'module';
//   dom.onload = function () {
//     if (state.log) { console.log ('Loaded module:', state.module); }
//     if (state.done) {
//       state.done ();
//     }
//   }
//   JsLoader.getParentDom ().appendChild (dom);
// }

/* Typical AMD loader code:
  (function (global, factory) {

    // global define: false
    // global exports: true
    if (typeof exports === 'object' && exports) {
      factory(exports); // CommonJS
    } else if (typeof define === 'function' && define.amd) {
      define(['exports'], factory); // AMD
    } else {
      factory(global); // <script>
    }

  }(this, function (global) {...}
*/



// let mod;
// mod = cache[item.alias];
// console.log('COOL:', [].slice.call(arguments));
// console.log('COOL:', item, cache, cache[item.url]);

// if (Object.keys(this.exports).length) {
//   mod = window.exports;
//   TmLoader.add({ item, mod });
// }
// else if (Object.keys(this.module.exports).length) {
//   mod = window.module.exports;
//   TmLoader.add({ item, mod });
// }
// else {
//   console.log('**** ERROR ****')
// }

// TmLoader.add({ item, state });

// // AMD Define method.
// window.define = function(key, factory) {
//   console.log('*** KEY:', key);
// }
// window.define.amd = true;
