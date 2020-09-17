import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

let ssbp;
if (window['getSsbp']) { ssbp = window['getSsbp'](); }

if (!ssbp) {
  // Start the angular app module.
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
}
else {
  ssbp.registry.add({
    name: 'eds-app',
    org: 'experian',
    type: 'angular',
    boot: (setup) => {
      // Start the angular app module.
      platformBrowserDynamic().bootstrapModule(AppModule)
        .then((mod) => {
          // Register and setup the startup angular module.
          setup({ mod });
        })
        .catch(err => console.error(err));
    }
  });
}
