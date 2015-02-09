'use strict';
var fs = require('fs')
var Path = require('path')
var ejs = require('ejs')
var inquirer = require('inquirer')
var mkdirp = require('mkdirp')
var templates = {
    "server": fs.readFileSync(Path.join(__dirname, './template/server'), 'utf-8'),
    "index": fs.readFileSync(Path.join(__dirname, './template/index.html'), 'utf-8'),
}

module.exports = function(path, options) {
    options.port = options.port || 1024
    if (options.engine)!options.views && (options.views = 'views')


    var serverPath = 'server.js'
    var packagePath = 'package.json'
    var indexPath = Path.join(options.public, 'index.html')
    var existPackage = fs.existsSync(packagePath)
    var existIndex = fs.existsSync(indexPath)

    /**
     * write static folder and default index.html
     */
    if (options.public !== '.') mkdirp.sync(options.public);
    options.cwd = Path.basename(process.cwd()) || ''

    if (!existIndex) {
        fs.writeFileSync(indexPath, ejs.render(templates.index, options), 'utf-8')
        console.log('Done, index.html is created!')
    }

    /**
     *  set package.json
     */
    var pjson
    if (existPackage) {
        try {
            pjson = (pjson = fs.readFileSync('package.json', 'utf-8')) ? JSON.parse(pjson) : {}
        } catch (e) {
            console.log('Your "package.json" file has syntax error : ' + e)
            return process.exit(1)
        }
    } else {
        pjson = {}
    }

    pjson.name === undefined && (pjson.name = options.cwd)
    pjson.scripts = pjson.scripts || {}
    pjson.scripts.start = 'node server'
    pjson.dependencies = pjson.dependencies || {}

    // custom dependencies
    var deps = ['express', 'colors']
    if (options.compress) deps.push('compression')
    if (options.engine) deps.push(options.engine)
    if (options.watch) deps.push('express-livereload')

    deps.forEach(function(dep) {
        pjson.dependencies[dep] = '*'
    })

    fs.writeFileSync('package.json', JSON.stringify(pjson, null, '\t'))

    /**
     *  write server.js file
     */
    var questions = []
    var writeServer = true
    var existServer = fs.existsSync(serverPath)
    var serverFile = ejs.render(templates.server, options)

    if (existServer) {
        questions.push({
            type: "confirm",
            name: "writeServer",
            message: "server.js is already exist, still rewrite?",
            default: true
        })
        inquirer.prompt(questions, function(answers) {
            existServer && (writeServer = answers.writeServer)
            writeServerFile()
        })
    } else {
        writeServerFile()
    }

    function writeServerFile() {
        if (writeServer) {
            console.log('\nDone, server.js is created!')
            fs.writeFileSync('server.js', serverFile, 'utf-8')
        }
        console.log('Done, ' + (existPackage ? 'package.json is updated!' : 'package.json is created!'))
        console.log('\nPlease use "npm install && npm start" to run server.')
    }
}
