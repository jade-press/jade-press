<h1 align="center">
    <img src="//jade-press.github.io/jade-press.org/public/jade-press-logo.png", alt="" />
</h1>

# jade-press

[![Build Status](https://travis-ci.org/jade-press/jade-press.svg?branch=master)](https://travis-ci.org/jade-press/jade-press)

cms based on mongodb, nodejs, koa, vue and more

## features

- based on mongodb(database and session), nodejs 6+, koa, vue.js...
- built in jade editor
- file upload (to mongodb gridfs), insert, manage
- custom routes
- plugin system
- theme system
- user system
- user groups and custom access control based on url
- post and category
- custom style & script & features file/image for every post
- can be used as a module to extend
- auto-database-update between different versions

## baisc use
```bash

# make sure your mongodb running,
# visit https://www.mongodb.com/download-center?jmp=nav#community for more info

# make sure cairo installed,
# visit https://github.com/Automattic/node-canvas/wiki/_pages for system spec

# install nodejs & npm,
# visit https://github.com/creationix/nvm

git clone git@github.com:jade-press/jade-press.git
cd jade-press
npm install
bower install
cp config-sample.js config.js

# read and edit config.js to define all the settings 

# install plugins if have plugins
gulp install

# run it
node app

```

then visit (by default) [http://127.0.0.1:7200](http://127.0.0.1:7200)

## use jade-press as a module

```javascript

//config.js

//.... other setting
    ,theme: {
        path: __dirname
        ,name: 'your-name'
        ,version: 'xx.xx.xx'
    }
//.... other setting

```

```javascript

//app.js

/*!
 * main entrance
**/

'use strict'

let init = require('jade-press').init
,co = require('co')
,config = require('./config')

co(init(config))
.then(function(app) {
    let port = config.local.port
    app.listen(port, '127.0.0.1', function() {
        console.log('' + new Date(), config.local.siteName, 'runs on port', port)
    })
}, function(err) {
    console.error(err.stack || err)
})

```

example:

[https://github.com/jade-press/blog.jade-press.org](https://github.com/jade-press/blog.jade-press.org)

## themes
check the examples:

[basic theme: jadepress-theme-pi](https://github.com/jade-press/jadepress-theme-pi)

[react spa theme(react, redux, history api)](https://github.com/jade-press/jadepress-react-spa)

[vue spa theme(vuex, vue-router)](https://github.com/jade-press/jadepress-vue-spa)

## plugin
check the example:
[https://github.com/jade-press/jadepress-plugin-qr](https://github.com/jade-press/jadepress-plugin-qr)

[https://github.com/jade-press/jadepress-redis](https://github.com/jade-press/jadepress-redis)

[https://github.com/jade-press/jadepress-static](https://github.com/jade-press/jadepress-static)

## todo

visit [issues](https://github.com/jade-press/jade-press/issues)

## license
MIT

