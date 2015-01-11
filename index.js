'use strict';
var fs = require('fs')
var Path = require('path')
var ejs = require('ejs')
var inquirer = require('inquirer')
var templates = {
    "server": fs.readFileSync(Path.join(__dirname, './template/server'), 'utf-8')
}

module.exports = function(path, options) {
    options.port = options.port || 1024
    if (options.engine)!options.views && (options.views = 'views')


    var serverPath = 'server.js'
    var packagePath = 'package.json'
    var serverFile = ejs.render(templates.server, options)
    var existServer = fs.existsSync(serverPath)
    var existPackage = fs.existsSync(packagePath)
    var questions = []
    var writeServer = true
    
    /**
     *  set package.json
     */
    var packageJSON
    try {
        if (existPackage) {
            packageJSON = (packageJSON = fs.readFileSync('package.json', 'utf-8')) ? JSON.parse(packageJSON):{}
        } else {
            packageJSON = {}
        }
    } catch (e) {
        console.log('Your "package.json" file has syntax error : ' + e);
        return process.exit(1)
    }
    if (!packageJSON.name) packageJSON.name = Path.basename(process.cwd()) || ''
    !packageJSON.scripts && (packageJSON.scripts = {})
    packageJSON.scripts.start = 'node server'

    !packageJSON.dependencies && (packageJSON.dependencies = {})

    // custom dependencies
    var deps = ['express', 'colors']
    switch (true) {
        case !!options.compress: deps.push('compression');;
        case !!options.engine: deps.push(options.engine);;
        case !!options.watch: deps.push('express-livereload');;
    }
    deps.forEach(function (dep) {
        packageJSON.dependencies[dep] = '*'
    })
    fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, '\t'))

    /**
     *  write server.js file
     */
    if (existServer) {
        questions.push({
            type: "confirm",
            name: "writeServer",
            message: "server.js is already exist, still rewrite?",
            default: true
        })
        inquirer.prompt(questions, function (answers) {
            existServer && (writeServer = answers.writeServer)
            writeServerFile()
        })
    } else {
        writeServerFile()
    }
    function writeServerFile () {
        if (writeServer) {
            console.log('\nDone, server.js is created!')
            fs.writeFileSync('server.js', serverFile, 'utf-8')
        }
        console.log('Done, ' + (existPackage ? 'package.json is updated!':'package.json is created!'))
        console.log('\nPlease use "npm install && npm start" to run server.')
    }
}
