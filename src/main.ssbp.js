// Load the app basic dependencies.
import '/inline.bundle.js';
import '/polyfills.bundle.js';
import '/styles.bundle.js';
import '/vendor.bundle.js';
import '/main.bundle.js';

// Configure the app.
let lifecycles;
try {
  const ssbp = window.getSsbp();
  if (!ssbp) {
    throw new Error(`ERROR: Unable to register app lifecycle hooks since SSPA is not loaded.`);
  }
  else {
    lifecycles = ssbp.lifecycle.setup ({
      name: 'sample-angular-app',
      org: 'abc-inc',
      type: 'angular',
      template: '<ng-app-root></ng-app-root>',
    })
  }
}
catch (err) {
  console.error(`ERROR: ${err.message}`);
  console.error(err);
}

export const bootstrap  = lifecycles.bootstrap;
export const mount      = lifecycles.mount;
export const unload     = lifecycles.unload;
export const unmount    = lifecycles.unmount;
