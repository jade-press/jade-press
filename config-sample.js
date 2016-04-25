
//start init
exports.init = {

	//root user email, will be saved to database, after init will be removed
	email: 'admin@example.com'

	//root user password, will be saved to database, after init will be removed
	,password: '123456a'
}
//end init

//local setting
exports.local = {
	port: 7200
	,env: 'dev' //or production
	,siteName: 'jadepress'
	,siteDesc: 'jade-press'
	,siteKeywords: 'jade-press'

	/* only if you use cdn
	,cdn: 'http://mycdn.com'
	*/
}

//common setting
exports.setting = {

	mongoStoreOptions: {

		//mongo session store url, visit  https://docs.mongodb.org/manual/reference/connection-string/ for more info
		url: 'mongodb://127.0.0.1:27017/sessions'

	}

	//mongodb url, visit  https://docs.mongodb.org/manual/reference/connection-string/ for more info

	,dbLink: 'mongodb://127.0.0.1:27017/jadepress'

	//theme
	,theme: 'jadepress-theme-pi'

	//use public cdn or not
	,usePublicCdn: false

	//route setting
	,publicRoute: {
		home: '/'
		,cat: '/cat/:slug'
		,post: '/:catSlug/:slug'
	}

	//secret
	,secret: 'szdd345fef3dsdsfer23dv1ebdasdl'

	//access log switch
	,logOn: true
}