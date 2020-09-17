// Load the app basic dependencies.
// import './inline.js';
import './runtime.js';
import './polyfills.js';
import './styles.js';
import './vendor.js';
import './main.ssbp.js';

// Configure the app.
let lifecycles;
try {
  const ssbp = window.getSsbp();
  if (!ssbp) {
    throw new Error(`ERROR: Unable to register app lifecycle hooks since SSPA is not loaded.`);
  }
  else {
    lifecycles = ssbp.lifecycle.setup({
      name: 'eds-app',
      org: 'experian',
      type: 'angular',
      template: '<experian-eds-app></experian-eds-app>',
    })
  }
}
catch (err) {
  console.error(`ERROR: ${err.message}`);
  console.error(err);
}

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unload = lifecycles.unload;
export const unmount = lifecycles.unmount;
