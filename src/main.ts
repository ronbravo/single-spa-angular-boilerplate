import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

let sspa;
if (window['getSspa']) { sspa = window['getSspa'](); }

if (!sspa) {
  // Start the angular app module.
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
}
else {
  sspa.registry.add({
    org: 'abc-inc',
    name: 'sample-angular-app',
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

