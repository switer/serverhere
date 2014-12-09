'use strict';
var fs = require('fs')
var Path = require('path')
var ejs = require('ejs')
var handlebars = require('handlebars')
var templates = {
    "server": fs.readFileSync(Path.join(__dirname, './template/server'), 'utf-8'),
    "package": fs.readFileSync(Path.join(__dirname, './template/package'), 'utf-8')
}

module.exports = function(path, options) {
    options.port = options.port || 1024
    if (options.view)!options.views && (options.views = 'views')

    /**
     *  custom set dependencies
     **/
    var deps = ''
    if (options.compression) {
        deps += '"compression": "*"'
    }
    if (options.view) {
        deps && (deps += ',')
        deps += ejs.render('"<%= view %>": "*"', options)
    }
    options.deps = deps


    var serverFile = ejs.render(templates.server, options)
    var packageFile = ejs.render(templates.package, options)
    fs.writeFileSync('server.js', serverFile, 'utf-8')
    fs.writeFileSync('package.json', packageFile, 'utf-8')
}