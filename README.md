# jade-press
cms based on mongodb, nodejs, koa, vue and more

## features

- based on mongodb(database and session), nodejs 4+, koa...
- built in jade editor
- file upload and insert
- custom routes
- plugin system
- theme system
- user system
- user groups and custom access control based on url
- post and category
- custom style & script for every post

## use
```bash

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

visit [https://github.com/jade-press/jade-press.org](https://github.com/jade-press/jade-press.org) as a example

## todo
- middleware array
- 404/500 extendable
- new logo & icon svg
- test
- docs
- windows support


