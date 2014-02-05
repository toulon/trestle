#!/usr/bin/env node

var util = require('util'),
  path = require('path'),
  optimist = require('optimist'),
  usage = require('./usage'),
  commands = require('../lib/commands'),
  properties = require('../lib/properties'),
  version = require('../package.json').version;

/*
If a command is unknown or incorrect parameters are entered the die
  - Displays the passed error message
  - Displays the usage message
  - Terminates the program
 */
var die = function(msg) {
  console.error('\n', msg, '\n');
  console.info(usage);

  process.exit(1);
}

var argv = optimist
  .usage(usage)
  .argv;

if (argv.h || argv.help) {
  console.info(usage);
  return;
}

if (argv.v || argv.version) {
  console.info('v' + version);
  return;
}

if (argv._.length == 0) {
  die('Command argument is required');
}

var commandName = argv._.shift().toLowerCase();

if (!commands[commandName]) {
  die('Command ' + commandName + ' is not known to trestle!');
}
/*
 Parse options which will look something like

 tim,IPAddress:String:required:true,model:Boolean,serialNbr:Number
This module populates the options array and builds the directory
structure using the trestle app <app name> command
 */
try {
  var options = properties.parse(argv._);

  options.templateDir = path.join(__dirname, '..', 'templates');

  if (process.env.TRESTLE_TEMPLATE_DIR) {
    options.templateDir = process.env.TRESTLE_TEMPLATE_DIR;
  }


  if (argv.templateDir || argv.t) {
    options.templateDir = argv.templateDir || argv.t;
  }

  // copy switches from argv to options.switches
  options.switches = {};
/*
There will be two args in this case (_  and $0)

i.e.
 _ key = tim,IPAddress:String:required:true,model:Boolean,serialNbr:Number
 $0 key = trestle
 */
  for (var key in argv) {
    if (key != '_' && key != '$0' && argv.hasOwnProperty(key)) {
      options.switches[key] = argv[key];
    }
  }
  console.log("Options = " + util.inspect(options))
  /*
  commandName is the command that will be executed
  (i.e.)
  app, scaffold, resource, view, route, or model

  Options are very important. The following is an example of
   Options = { model:
   { singular: 'blogb',
   singularCapitalized: 'Blogb',
   plural: 'blogbs',
   pluralCapitalized: 'Blogbs',
   route: '/blogbs',
   path: 'blogb',
   relativePath: '',
   relativeRootPath: '..' },
   properties: [],
   defaultProperty: undefined,
   templateDir: '/usr/local/Cellar/node/0.8.14/lib/node_modules/trestle/templates',
   switches: {} }
   */
  commands[commandName](options);
} catch (e) {
  die(e);
}

