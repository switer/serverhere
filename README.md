serverhere
=========
![logo](http://switer.qiniudn.com/assitant.png)

Create an express static server in current director with some options, includes gzip/livereload/view engine/port.
If you thinks another something is useful and helpful, please tell me. 

## Installing
```bash
npm install serverhere -g
```

## Example

Following command create a server 
- that watch `./public` for livereload 
- and enable `gzip` 
- and use `jade` as view engine 
- and default set `port` to 2014 
- and use `./public` as static folder

```bash
serverhere --watch public --compress -e jade --port 2014 public
```
Before running, you need to install some dependencies:
```
npm install
```
Then run command to start your server:
```
npm start
```

## Usage
```cli
 Usage: serverhere [options] <path>

        (path default is ".")


 Options:

   -h, --help          output usage information
   -V, --version       output the version number
   -p --port <port>    server listen port, default to 1024
   -c --compress       enable gzip
   -e --engine <type>  view's engine ejs/jade, default not set
   -v --views <path>   views director path, default to "views"
   -w --watch <dir>    watch a dir and reload browser when files changed
```

