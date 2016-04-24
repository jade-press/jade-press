# jade-press
blog cms based on mongodb, nodejs

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

## use
```bash
git clone https://github.com/jade-press/jade-press.git
cd jade-press
npm install
bower install
cp config-sample.js config.js

#edit config.js to define database url etc, 
# need your mongodb ready to connct
node app

#or inproduction
# pm2 start server.json

#or dev
# pm2 start dev-server.json

```

then visit (by default) [http://127.0.0.1:7200](http://127.0.0.1:7200)

# todo
- resetpassword
- test

