# Single SPA Boilerplate - Sample Angular v10 App

This project was build with the [Single SPA Boilerplate](https://github.com/ronbravo/single-spa-boilerplate) repo. A set of boilerplate configurations for working with the [Single SPA](https://single-spa.js.org/) framework. The boilerplates are broken out into separate branches with a desire to keep them as minimal as possible. Each branch should have it's own `README.md` file with specific instructions for working with that particular setup.

**NOTE:** You may want to replace the information in the `package.json` with the appropriate information about the maintaining organization or company.

## Cli Commands

```
// Clone the root app.
git clone -b release/root-app git@github.com:ronbravo/single-spa-boilerplate.git root-app

// Clone the sample app for Angular.
git clone -b release/sample-angular-v10-app git@github.com:ronbravo/single-spa-boilerplate.git sample-angular-app

```

### Change CSS Pre-Processor

By default the boilerplate uses [LessCSS](http://lesscss.org/) due to the ability of the PreProcess to allow compositing of CSS classes. To change the pre-processor to something else use the commands below which is referenced in [this tutorial](https://medium.com/@ngubanethabo.ambrose/migrate-from-css-to-scss-stylesheets-for-existing-angular-application-d61f8061f5b7).

```
// Angular 6+
ng config schematics.@schematics/angular:component.styleext scss

// Below Angular 6
ng config defaults.styleExt=scss

// or

ng set defaults.styleExt=scss

```

## Sample Angular v10 App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.1.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
