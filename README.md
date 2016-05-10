<h1 align="center">
    <img src="http://jade-press.org/public/jade-press-logo.png", alt="" />
</h1>

# jade-press

[![Build Status](https://travis-ci.org/jade-press/jade-press.svg?branch=master)](https://travis-ci.org/jade-press/jade-press)

cms based on mongodb, nodejs, koa, vue and more

## features

- based on mongodb(database and session), nodejs 5+, koa...
- built in jade editor
- file upload (to mongodb gridfs), insert, manage
- custom routes
- plugin system
- theme system
- user system
- user groups and custom access control based on url
- post and category
- custom style & script & features file/image for every post

## use
```bash

#install mongodb if needed(ubuntu14.04)
# sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
# echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
# sudo apt-get install -y mongodb-org

#for mongodb driver ubuntu (optional)
#sudo apt-get install libkrb5-dev
#or visit https://github.com/mongodb/node-mongodb-native#troubleshooting for more

#for canvas ubuntu (optional)
#sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
#visit https://www.npmjs.com/package/canvas for more platform

git clone https://github.com/jade-press/jade-press.git
cd jade-press
npm install
bower install
cp config-sample.js config.js

#read and edit config.js to define all the settings 

#install plugins
gulp install

# need your mongodb ready to connect
node app

```

then visit (by default) [http://127.0.0.1:7200](http://127.0.0.1:7200)

## use jade-press as a module

visit [https://github.com/jade-press/blog.jade-press.org](https://github.com/jade-press/blog.jade-press.org) as a example

## todo
- post content search support
- new logo & icon svg
- more test
- docs
- windows support

## license
MIT

