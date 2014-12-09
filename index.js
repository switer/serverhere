'use strict';
var fs = require('fs')
var Path = require('path')
var ejs = require('ejs')
var inquirer = require('inquirer')
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

    var serverPath = 'server.js'
    var packagePath = 'package.json'
    var serverFile = ejs.render(templates.server, options)
    var packageFile = ejs.render(templates.package, options)
    var existServer = fs.existsSync(serverPath)
    var existPackage = fs.existsSync(packagePath)
    var questions = []
    var writeServer = true
    var writePackage = true

    if (existServer) {
        questions.push({
            type: "confirm",
            name: "writeServer",
            message: "server.js is already exist, still rewrite?",
            default: true
        })
    }
    if (existPackage) {
        questions.push({
            type: "confirm",
            name: "writePackage",
            message: "package.json is already exist, still rewrite?",
            default: true
        })
    }
    if (existServer || existPackage) {
        inquirer.prompt(questions, function (answers) {
            existServer && (writeServer = answers.writeServer)
            existPackage && (writePackage = answers.writePackage)
            writeFiles()
        })
    } else {
        writeFiles()
    }
    function writeFiles () {
        if (writeServer) {
            console.log('\nDone, server.js is created!')
            fs.writeFileSync('server.js', serverFile, 'utf-8')
        }
        if (writePackage) {
            console.log('\nDone, package.json is created!')
            fs.writeFileSync('package.json', packageFile, 'utf-8')
        }

        console.log('\nPlease use "npm install && npm start" to run server.')
    }
}
