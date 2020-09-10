# SampleAngularV5App

This is a boilerplate to begin building for a micro frontend app using the Single SPA library. To run the server just run: `npm run dev`. To change the port just modify the `config` inside the `package.json`.

## NOTES:

### Angular v5.2.0

This project was built with a sepcific version of Angular. Most of this should already be setup in the `package.json` file.

### Single SPA and Single SPA Angular

This was built for a specific version of Single SPA and Single SPA Angular:

* Single SPA: 4.0.0
* Single SPA Angular: 3.6.0

### NodeJs Version 10.6.0

This project was built using node version `10.6.0`. A tool like `nvm` with the command `nvm install 10.6.0` can be used to install the correct nodejs version.

### Skipping the Typescript Library Check

The setting of this project will [skip checking the TsLibrary](https://stackoverflow.com/a/52404148) because a lot of the dependencies on this project are really old. So having Typescript check the libraries can cause build errors. This repo has that disabled by default in the `src/tsconfig.app.json` by setting `{ "compilerOptions": { ... "skipLibCheck": true, ... } }`. Set it to `false` to re-enable the checking.

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
