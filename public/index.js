// Load the Single Spa Setup.
window.tmLoaderQueue({
  list: [
    'https://cdnjs.cloudflare.com/ajax/libs/voca/1.4.0/voca.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/single-spa/5.5.5/umd/single-spa.min.js',
  ],
  name: 'SSPA Dependencies and Core',
  module: './sspa/Sspa.js',
  done: () => {
    let spa;

    // Allow for fetching the apps to load.
    function loadApps () {
      return {
        apps: [
          {
            name: 'sample-angular-v5-app',
            app: () => import ('http://localhost:4302/main.sspa.js'),
            activeWhen: '/',
            customProps: {
              active: true,
              time: Date.now (),
            }
          }, 
        ]
      };
    }

    // Register each of the apps and setup the global sspa context.
    spa = window.getTmLoader().find('single-spa');
    loadApps ().apps.forEach ((app) => {
      spa.registerApplication (app);
    });

    // Start the app.
    spa.start();   
  }
});









// import './bob.js';
// new Promise(() => {
//   import ('https://cdnjs.cloudflare.com/ajax/libs/voca/1.4.0/voca.min.js');
// })

// console.log('WHAT:', module, exports);

// (function () {
//   function define(factory) {
//     // factory();
//     // console.log(arguments);
//     // window.v = factory();
//     // console.log('dumb', factory);
//   }
//   define.amd = {};

//   import('https://cdnjs.cloudflare.com/ajax/libs/voca/1.4.0/voca.min.js').then(() => {
//   });
// })();
// const exports = {};
// const module = {};
// module.exports = {};


// (function (global, factory) {
//   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
//   typeof define === 'function' && define.amd ? define(factory) :
//     (global.v = factory());
// }(this, (function () { console.log('why...'); })));

// // TODO: Import VocaJs...
// export class AngularLifeCycle {
//   static setup (args) {
//     let { name = '', org = 'sspa-global' } = args;
//     let app, id, mountDom, sspa;

//     sspa = window ['$__sspa'];
//     id = v.slugify('sspa-' + org + '/' + name);
//     app = sspa.registry.find ({ org, name });

//     // templateName = Voca.slugify(id);
//     app.template = `<ng-${id}-root></ng-${id}-root>`;

//     if (args.template) { app.template = args.template; }

//     return {
//       bootstrap: function (props) {
//         return Promise
//           .resolve ()
//           .then (() => {
//             // One-time initialization code goes here
//             console.log (`SSPA: Bootstrapped the [${app.name}] app.`);
//           });
//       },
//       mount: function (props) {
//         return Promise
//           .resolve ()
//           .then (() => {
//             // Ensure the correct DOM mount exists.
//             mountDom = document.querySelector ('#' + id);
//             if (!mountDom) {
//               mountDom = document.createElement ('div');
//               mountDom.id = id;
//               mountDom.innerHTML = app.template;
//               document.body.appendChild (mountDom);
//             }

//             // Do framework UI rendering here
//             if (app && app.boot) {
//               app.boot (({ mod }) => {
//                 app.mod = mod;
//                 console.log (`SSPA: Mounted the [${app.name}] app.`);
//               });
//             }
//             else {
//               console.error (`ERROR: SSPA was unable to mount the [${org}/${name}] app.`)
//             }
//           });
//       },
//       unmount: function (props) {
//         return Promise
//           .resolve ()
//           .then (() => {
//             // Do framework UI unrendering here
//             if (mountDom && mountDom.parentNode) {
//               mountDom.parentNode.removeChild (mountDom);
//             }
//             console.log (`SSPA: Un-mounted the [${app.name}] app.`);
//           });
//       },
//       unload: function (props) {
//         return Promise
//           .resolve ()
//           .then (() => {
//             // Hot-reloading implementation goes here
//             console.log (`SSPA: Un-loaded the [${app.name}] app.`);
//           });
//       },
//     }
//   }
// }

// export class LifeCycle {
//   static setup(args) {
//     switch (args.type) {
//       case 'angular':
//         return AngularLifeCycle.setup (args);
//     }
//   }
// }

// const cache = {};
// export class Registry {
//   static add ({ boot, name = '', org = 'sspa-global' }) {
//     console.log (`SSPA: Adding`);
    
//     if (!cache [org]) { cache [org] = {}; }
//     cache [org] [name] = {
//       name: `${org}/${name}`,
//       boot,
//     }
//   }

//   static getCache () { return cache; }

//   static find ({ name = '', org = 'sspa-global' }) {
//     let value;
//     value = cache [org];
//     if (!value) { return undefined; }
//     return cache [org] [name];
//   }
// }

// export class Sspa {
//   lifecycle = LifeCycle;
//   registry = Registry;
// }

// System.import('https://cdnjs.cloudflare.com/ajax/libs/single-spa/5.5.5/umd/single-spa.min.js').then(async (singleSpa) => {
//   const { registerApplication, start } = singleSpa.default;
  
//   // Setup the global sspa context.
//   window.$__sspa = new Sspa ();

//   // Allow for fetching the apps to load.
//   function loadApps () {
//     return {
//       apps: [
//         {
//           name: 'sample-angular-v5-app',
//           app: () => import ('http://localhost:4302/main.js'),
//           activeWhen: '/',
//           customProps: {
//             active: true,
//             time: Date.now (),
//           }
//         }, 
//       ]
//     };
//   }

//   // Register each of the apps.
//   loadApps ().apps.forEach ((app) => {
//     registerApplication (app);
//   });

//   // Start the app.
//   start ();
// });

//   <script src="https://unpkg.com/core-js-bundle@3.1.4/minified.js"></script>
//   <script src="https://unpkg.com/zone.js@0.10.3/dist/zone.js"></script>
//   <script src="https://unpkg.com/import-map-overrides@1.15.1/dist/import-map-overrides.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/4.0.0/system.min.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/4.0.0/extras/amd.min.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/4.0.0/extras/named-exports.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/4.0.0/extras/named-register.min.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/single-spa/5.5.5/umd/single-spa.min.js"></script>
//   <!-- < script src = "https://cdnjs.cloudflare.com/ajax/libs/single-spa/5.5.0/system/single-spa.min.js" ></script > -->
//   < !-- < template id = "single-spa-layout" >
// <single-spa-router>
//   <application name="bob"></application>
// </single-spa-router>
//   </template > -->
