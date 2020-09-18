import { Component } from '@angular/core';
import UIkit from 'uikit';
// import Icons from 'uikit/dist/js/uikit-icons';

@Component({
  selector: 'experian-eds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'sample-angular-v8-app';

  constructor() {
    // loads the Icon plugin
    // UIkit.use(Icons);

    // components can be called from the imported UIkit reference
    UIkit.notification('Hello world.');
  }
}
