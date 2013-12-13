Trestle is a scaffolding tool for node.js that originated from [trestle](https://github.com/saintedlama/trestle). In 6 commands you can have complete CRUD application, your mileage may vary of course, but see my wiki for details https://github.com/toulon/trestle/wiki

Generated projects rely on [express](http://expressjs.com/) and [mongoose](http://mongoosejs.com/) without any persistence abstractions,
additional libraries or frameworks. Just plain express and mongoose!

# Roadmap
**Done**
- ~~Rename to Trestle~~
- ~~Switch to Bootstrap 3.0~~
- ~~Added ability to sort columns using tablesorter~~

**Doing**
- Fix the following configurations that do not seem to work
    trestle: main: (app.js)
    trestle: scripts/start: (nodemon -w models -w config -w routes app.js)
    trestle: repository:
- Make all config mongohq ready

**Future**
- Add pagination
- Work on new logo

# Installing Trestle

	npm install trestle -g

# Mini Tutorial

First cd to the directory where the project should be created

	cd /path/to/projects/root

Create a project skeleton via

	trestle app testapp

Next cd to testapp

	cd testapp

And install required packages through npm

	npm install

## Scaffolding - adding collections
Create a model, route and views via `scaffold` command. The model
should have two properties "title" and "description" where title is required.

	trestle scaffold <collection> title:string:required:true description

Minimum configuration to create a collection (all fields will be type string)
	trestle scaffold <collection> <field1>:required <field2> <field3> <field4>

Note: The first field must have property required as it will be the column that will be clicked
			on to edit the record.

Model validators are specified after property name and type in plain mongoose syntax. In case
no type is specified the property will be of type string.

Mongoose types 'String', 'Number', 'Date', 'Buffer', 'Boolean', 'ObjectId', 'Array' are supported. Additionally
the types 'Datetime' and 'Textarea' are supported which result in a datetime html 5 input tag and a textbox tag.
Types are case insensitive. If (for example) password is recognized as a password and the test will appear as "*"s

Now start `node app.js` and navigate your browser to `http://localhost:3000/tests`

### Scaffolding restful routes

You can create a JSON REST endpoint by scaffolding a model and its corresponding routes. The arguments are the same as above, but instead of _scaffold_ use _scafffold:rest_ like this

	trestle resource post title:string:required:true description


# Usage

```
Project generator for node.js using express and mongoose

Usage:
  trestle [options] command [arguments]

Options:
  --help, -h                 Output this usage dialog
  --version, -v              Output the version of trestle

Commands:
  app <collection>                 Create a new application
  scaffold <collection> [attrib]   Create a new route, model and views for <collection>
  resource <collection> [attrib]   Creates a model and route for resource <collection>
  view <collection> [attrib]       Creates views for a <collection>
  route <collection> [attrib]      Creates a route for a <collection>
  model <collection> [attrib]      Creates a new mongoose model for a <collection>

collection:
  Name should be provided as singular, so use `item` instead of `items`. For
  `scaffold`, `view`, `route`, `resource`, `model` commands collection
  accepts a path prefix. For example `admin/item` will create model, routes and
  views in an admin directory. Routes will then point to `/admin/items`. This
  option can be useful if you plan to add some authentication based on routes
  later on.

attrib:
  Attributes are used to describe properties of models used in routes, views
  and of course models using the schema:

  field:type:validator:validatorValue:validator:validatorValue...

Examples:
  trestle app todo              Generates an express app skeleton
  trestle scaffold item         Generates item model, route and views supporting
                             basic CRUD operations
  trestle view item             Generates item views

  trestle scaffold collection field:string:required:true

                             Generates item model, route and views with a single
                             property "collection" that is required.
```

# What trestle creates

After executing `trestle app <project>` you'll find the following structure in your file system.

    |   app.js
    |   helpers.js
    |   package.json
    |   README.md
    |
    +---config
    |       defaults.js
    |       development.js
    |       index.js
    |       production.js
    |
    +---lib
    |       model-mapper.js
    |
    +---public
    |   +---css
    |   |       custom.css
    |   |
    |   \---vendor
    |       +---bootstrap
    |       |   +---css
    |       |   |       bootstrap-responsive.css
    |       |   |       bootstrap-responsive.min.css
    |       |   |       bootstrap.css
    |       |   |       bootstrap.min.css
    |       |   |
    |       |   +---fonts
    |       |   |       glyphicons-halflings-regular.eot
    |       |   |       glyphicons-halflings-regular.svg
    |       |   |       glyphicons-halflings-regular.ttf
    |       |   |       glyphicons-halflings-regular.woff
    |       |   |
    |       |   \---js
    |       |           bootstrap.js
    |       |           bootstrap.min.js
    |       |
    |       \---jquery
    |           \---js
    |                   jquery.min.js
    |       \---tablesorter
    |           \---addons
    |           \---beta-testing
    |           \---css
    |           \---docs
    |           \---js
    |           \---README.md
    |           \---testing
    |                   changelog.txt
    |                   component.json
    |                   index.html
    |                   package.json
    |                   tablesorter.jquery.json
    |                   test.html
    |
    +---routes
    |       index.js
    |
    \---views
        |   index.jade
        |   layout.jade
        |
        \---mixins
                form-helpers.jade

## Application structure explained

### app.js
Creates and initializes an express app with a mongoDb connection configured. Routes will be setup by requiring the routes
directory directly. See routes below.

### helpers.js
Defines some jade/html helpers for displaying error messages and displaying values. Reusable code

### package.json
Initial package with value entered in the prompt dialog

### README.md
Empty readme to silence npm

### config
The config directory is required by `app.js` to load the configuration files. Trestle assumes that you
	have four config files and two environment variables
		NODE_ENV - development or production
		PORT - any valid Port number

* __defaults__ Defines defaults that are used in development and production mode -
			Address, Port web page answers and the database name and location - Modify this if database if remote
* __development__ Defines configuration values used in development mode only
			Verbose logging, default Port (3000) assignment, and Secret
* __production__ Defines configuration values used in production mode only -
			No logging, default Port (8000) assignment, and secret
			Do not pass the config.address to the Express Server startup
* __index.js__ Checks environment variables

Trestle loads defaults first, then loads the configuration file `development` or `production` depending on the
	current `NODE_ENV` environment variable and overrides all default values with the "development" or "production"
	values.

### lib
Trestle ships with a single library file that is responsible to map values provided in request body to a mongoose
model.

### public
The public folder contains a quite up to date version of [twitter bootstrap](http://twitter.github.com/bootstrap/) under `vendor/boostrap`,
an up to date version of [jQuery](http://jquery.com/) under `vendor/jquery` and a `custom.css` file under css.

Trestle organizes all shipped 3rd party css/javascript libraries are placed in the `vendor` directory and follows a `js`, `css`, `img` schema
for vendor libraries. You are free to place your libraries wherever you want :)

### routes
All generated routes will be generated under routes. After creating an app with Trestle, you'll find a single
	`index.js` file in this folder. Index.js requires all files that are in or routes or a sub directory of routes
	to initialize the route. In case you require a route to be defined before another route you can always require
	that route in `index.js` or load routes manually in a defined order.

index.js also defines a route to `/` to render a nice getting started page. This functionality can be removed
	without harming the system!

### views
All generated view will be generated under views. After creating an app with Trestle, you'll find an index.jade
	that is a welcome file to display some help text or defined routes, a layout.jade file that defines the layout
		used by all generated views and a mixin folder that defines mixins used in Trestle generated views.

## Trestle Change Log
### 0.2.4
* Fixed bugs in app.js.ejs

### 0.2.3

* Added column sorting using tablesorter
* Added display message if using custom template
* Changed Express server startup parameters depending on whether not in "production"
* Converted original ADM icons that were on the end of each line into a clickible area in the first column

Truss Change Log
### 0.2.2

* Fixed indentation to comply with Node.js style guides
* Added a form helper for single select boxes

### 0.2.1

* Updated the edit and create templates to use the same form
* Fixed issue with ObjectId not working in model creation

### 0.2.0

* Added Bootstrap 3 support
* Errors on forms now use Bootstrap 3 class "has-error"
* Mixin invocation uses the now standard "+" symbol instead of "mixin"

## Bumm Change Log
### 0.1.5

* Add option to use mongodb session store
* Support directories when scaffolding models, views and routes
* Render a nice start page
* Support rest resources for api services

### 0.1.4

* Express and Mongoose updates
* Fix startup scripts
* Provide better error messages
* Use mixins to render forms

### 0.1.3

* Add `npm init` like prompt to specify generated package.json values by [thomas peklak](https://github.com/thomaspeklak)

### 0.1.2

* Minor bug fixes in views
* Basic support for array types
* Reorganizes public assets in vendor folder
* Disable 'x-powered-by' header

### 0.1.1

* Bootstrap update
* Mongoose update

### 0.1.0

* Initial version
