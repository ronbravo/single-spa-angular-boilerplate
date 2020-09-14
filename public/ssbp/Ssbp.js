export class AngularLifeCycle {
  static setup(args) {
    let { name = '', org = 'ssbp-global' } = args;
    let app, id, mountDom;

    id = voca.slugify('ssbp-' + org + '/' + name);
    app = Ssbp.registry.find({ org, name });

    app.template = `<ng-${id}-root></ng-${id}-root>`;
    if (args.template) { app.template = args.template; }

    return {
      bootstrap: function (props) {
        return Promise
          .resolve()
          .then(() => {
            // One-time initialization code goes here
            console.log(`SSBP: Bootstrapped the [${app.name}] app.`);
          });
      },
      mount: function (props) {
        return Promise
          .resolve()
          .then(() => {
            // Ensure the correct DOM mount exists.
            mountDom = document.querySelector('#' + id);
            if (!mountDom) {
              mountDom = document.createElement('div');
              mountDom.id = id;
              mountDom.innerHTML = app.template;
              document.body.appendChild(mountDom);
            }

            // Do framework UI rendering here
            if (app && app.boot) {
              app.boot(({ mod }) => {
                app.mod = mod;
                console.log(`SSBP: Mounted the [${app.name}] app.`);
              });
            }
            else {
              console.error(`ERROR: SSBP was unable to mount the [${org}/${name}] app.`)
            }
          });
      },
      unmount: function (props) {
        return Promise
          .resolve()
          .then(() => {
            // Do framework UI unrendering here
            if (mountDom && mountDom.parentNode) {
              mountDom.parentNode.removeChild(mountDom);
            }
            console.log(`SSBP: Un-mounted the [${app.name}] app.`);
          });
      },
      unload: function (props) {
        return Promise
          .resolve()
          .then(() => {
            // Hot-reloading implementation goes here
            console.log(`SSBP: Un-loaded the [${app.name}] app.`);
          });
      },
    }
  }
}

export class LifeCycle {
  static setup(args) {
    switch (args.type) {
      case 'angular':
        return AngularLifeCycle.setup(args);
    }
  }
}

const cache = {};
export class Registry {
  static add({ boot, name = '', org = 'ssbp-global' }) {
    console.log(`SSBP: Adding app [${org}/${name}] `);

    if (!cache[org]) { cache[org] = {}; }
    cache[org][name] = {
      name: `${org}/${name}`,
      boot,
    }
  }

  static getCache() { return cache; }

  static find({ name = '', org = 'ssbp-global' }) {
    let value;
    value = cache[org];
    if (!value) { return undefined; }
    return cache[org][name];
  }
}

export class Ssbp {
  static lifecycle = LifeCycle;
  static registry = Registry;

  constructor() {
    window.getSsbp = function () {
      return Ssbp;
    }
  }
}

const voca = window.getTmLoader ().find ('voca');
new Ssbp();
