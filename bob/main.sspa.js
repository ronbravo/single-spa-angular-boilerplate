// Load the app basic dependencies.
// import '/inline.bundle.js';
// import '/polyfills.bundle.js';
// import '/styles.bundle.js';
// import '/vendor.bundle.js';
// import '/main.bundle.js';

import '/runtime.js';
import '/polyfill.js';
import '/styles.js';
import '/vendor.js';
import '/main.js';

// Configure the app.
let lifecycles;
try {
  const sspa = window.getSspa();
  if (!sspa) {
    throw new Error(`ERROR: Unable to register app lifecycle hooks since SSPA is not loaded.`);
  }
  else {
    lifecycles = sspa.lifecycle.setup ({
      type: 'angular',
      org: 'abc-inc',
      name: 'sample-angular-app',
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
