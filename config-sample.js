
//start init
exports.init = {

	//root user email, will be saved to database
	email: 'admin@example.com'

	//root user password, will be saved to database
	//and you will be forced change password when first time login
	,password: '123456a'

}
//end init

//local setting
exports.local = {

	//port
	port: 7200

	//listen address can be 'localhost' or '127.0.0.1' or domain name like 'example.com', default is undefined
	//,listenAddress: 'locahost'

	,env: process.env.NODE_ENV || 'dev' //or 'production'

	//sitename, you should edit it
	,siteName: 'jadepress'

	//site desc, you should edit it
	,siteDesc: 'jade-press is a blog cms based on mongodb, nodejs...'

	//site keywords, you should edit it
	,siteKeywords: 'jade-press,nodejs,mongodb'

	/* only if you use seprate domain to serve static resources
	,cdn: 'http://mycdn.com'
	*/

	/* only if you use seprate domain to server uploaded files
	,fileServer: 'http://myfile-server.com'
	*/

}

//common setting
exports.setting = {

	mongoStoreOptions: {

		//mongo session store url, 
		//visit  https://docs.mongodb.org/manual/reference/connection-string/ for more info
		url: 'mongodb://127.0.0.1:27017/sessions'

	}

	//secret used to code session and password
	//change it
	,secret: 'szdd345fef3dsdsfer23dv1ebdasdl'

	//mongodb url, 
	//visit https://docs.mongodb.org/manual/reference/connection-string/ for more info

	,dbLink: 'mongodb://127.0.0.1:27017/jadepress'

	//theme
	//can also be a object like:
	//
	/*
	,theme: {
		path: '/home/zxd/dev/jade-press.org'
		,name: 'jade-press-org'
		,version: 'v0.1.0'
	}
	*/

	,theme: 'jadepress-theme-pi'

	//plugins, format just like dependencies in package.json
	//make sure your theme is in plugins too
	//plugins will be installed by run "gulp install"
	,plugins: {
		"jadepress-theme-pi": "*"
	}

	//use public cdn or not
	,usePublicCdn: false

	//route setting
	,publicRoute: {
		home: '/'
		,cat: '/cat/:slug'
		,post: '/:catSlug/:slug'
	}

	//access log switch
	,logOn: true

	// mail server config
	// when mail server exist, jadepress can send mail to users to do reset password etc.
	// to know more how to config, vsit http://nodemailer.com/
	// or https://github.com/nodemailer/nodemailer-wellknown#supported-services
	/*
	,mailSender: {
		name: 'your-sender-name'
		,address: 'your-id@gmail.com'
	}
	,mailServer: {
		service: 'Gmail'
		,auth: {
			user: 'your-id@gmail.com'
			,pass: 'your password'
		}
	}
	*/
	
}