'use strict';
var fs = require('fs')
var Path = require('path')
var ejs = require('ejs')
var templates = {
    "server": fs.readFileSync(Path.join(__dirname, './template/server'), 'utf-8'),
    "package": fs.readFileSync(Path.join(__dirname, './template/package'), 'utf-8')
}

module.exports = function(path, options) {
    options.port = options.port || 1024
    if (options.engine)!options.views && (options.views = 'views')

    /**
     *  custom set dependencies
     **/
    var deps = '"express": "*"'
    var spliter = ',\n        '

    // colors
    deps += spliter + '"colors":"*"'
    if (options.compress) {
        deps += spliter + '"compression": "*"'
    }
    if (options.engine) {
        deps += spliter + ejs.render('"<%= engine %>": "*"', options)
    }
    if (options.watch) {
        deps += spliter + '"express-livereload": "*"'
    }
    options.deps = deps

    var serverFile = ejs.render(templates.server, options)
    var packageFile = ejs.render(templates.package, options)
    fs.writeFileSync('server.js', serverFile, 'utf-8')
    fs.writeFileSync('package.json', packageFile, 'utf-8')
}