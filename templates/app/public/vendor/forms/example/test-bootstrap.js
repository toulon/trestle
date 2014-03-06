/*jslint node: true */
'use strict';

var http = require('http'),
  util = require('util'),
  fs = require('fs'),
  forms = require('../lib/forms'),
  jsontemplate = require('./json-template'),
  parse = require('url').parse;

var fields = forms.fields,
  validators = forms.validators,
  widgets = forms.widgets;

// template for the example page
var template = jsontemplate.Template(
  fs.readFileSync(__dirname + '/page.jsont').toString()
);

var inputWithOptionalAttributes = forms.widgets.text({
  placeholder: 'Where do you "work"?',
  'data-toggle': 'focus'
});

var my_form = forms.create({
  title: fields.string({
    required: true,
    widget: widgets.text({ classes: ['input-with-feedback'] }),
    errorAfterField: true,
    cssClasses: {
      label: ['control-label col col-lg-3']
    }
  }),

  description: fields.string({
    errorAfterField: true,
    widget: widgets.text({ classes: ['input-with-feedback'] }),
    cssClasses: {
      label: ['control-label col col-lg-3']
    }
  }),
  date1: fields.date({
    errorAfterField: true,
    widget: widgets.text({ classes: ['input-with-feedback'] }),
    cssClasses: {
      label: ['control-label col col-lg-3 form-control input-group date data-date-format="mm-dd-yyyy"']
    }
  })
});

var bootstrap_field = function (name, object) {
  var label = object.labelHTML(name);
  var error = object.error ? '<p class="form-error-tooltip">' + object.error + '</p>' : '';
  var widget = '<div class="controls col col-lg-9">' + object.widget.toHTML(name, object) + error + '</div>';
  return '<div class="field row control-group ' + (error !== '' ? 'has-error' : '')  + '">' + label + widget + '</div>';
}

http.createServer(function (req, res) {
  my_form.handle(req, {
    success: function (my_form) {
      var req_data = require('url').parse(req.url, 1).query;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<h1>Success!</h1>');
      res.end('<pre>' + util.inspect(my_form.data) + '</pre>');
    },
    other: function (my_form) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(template.expand({form: my_form.toHTML(function (name, object) { return bootstrap_field(name, object); })}));
    }
  });

}).listen(8081);

util.puts('Server running at http://127.0.0.1:8081/');

