import { TmLoader } from './TmLoader.js';

Object.defineProperty (window, 'getTmLoader', {
  value: function () { return TmLoader; },
});

Object.defineProperty (window, 'tml', {
  value: TmLoader,
});

Object.defineProperty (window, 'require', {
  value: TmLoader.require,
});

// let queues;
// window.getTmLoader =


// // Load the cached queues.
// if (window.$___tm_loader_temp_queues) {
//   queues = window.$___tm_loader_temp_queues;
//   delete window.$___tm_loader_temp_queues;
//
//   if (queues) {
//     queues.forEach((queue) => {
//       TmLoader.load(queue);
//     });
//   }
// }

// // Set a list of items to load.
// window.tmLoader = function (queue) {
//   // if (!window.getTmLoader) {
//   //   if (!window.$___tm_loader_temp_queues) { window.$___tm_loader_temp_queues = []; }
//   //   window.$___tm_loader_temp_queues.push(queue);
//   // }
//   // else {
//     window.getTmLoader().load(queue);
//   // }
// }
