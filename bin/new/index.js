const args = require('minimist')(process.argv.slice(2));
const deepmerge = require('deepmerge');
const nw = require('./app.js');
const pj = require('./project.js');

function newProject() {}


let config;
config = {};

if (args.app) {
  config = deepmerge({}, {
    app: args.app,
    type: args.type,
  })
}
else if (args.project) {
  config = deepmerge({}, {
    project: args.project,
  })
}
else {
  console.error(`ERROR: Invalid command ${args._[0]}`)
}

// console.log(config);
if (config.app) { nw.app(config); }
if (config.project) { pj.app(config); }
