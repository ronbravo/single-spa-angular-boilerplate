# Single SPA Boilerplate

This project was build with the [Single SPA Boilerplate](https://github.com/ronbravo/single-spa-boilerplate) repo. A set of boilerplate configurations for working with the [Single SPA](https://single-spa.js.org/) framework. The boilerplates are broken out into separate branches with a desire to keep them as minimal as possible. Each branch should have it's own `README.md` file with specific instructions for working with that particular setup.

**NOTE:** You may want to replace the information in the `package.json` with the appropriate information about the maintaining organization or company.

## Install Cli Tool

After cloning this repo, go into the repo project and run:

```
cd single-spa-boilerplate
npm link
```

Then confirm the proper linkage and that the cli tool is running by typing `spa` into the terminal and there should be a response.

## Sample Cli Commands

Here are a few commands that can be run with the cli tool. **NOTE:** The commands should be run **inside** a project created with the cli tool. Check the examples below to see how this is done.

```
// Add an spa project
spa new --project <proj-name>

// Add an angular spa app to a project.
spa new --app <app-name> --type <app-types>

// Possible app types
angular-10 - An angular 10 compatible spa micro app.
```
