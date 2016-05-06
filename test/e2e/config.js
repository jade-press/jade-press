
var port = exports.port = 9806

exports.pages = [

	{
		title: 'home'
		,waitForElementVisible: '#wrapper'
		,elementPresent: '#nav'
		,containsText: ['h2', 'hello, jadepress!']
		,elementCount: ['h2', 1]
		,url: 'http://127.0.0.1:' + port
	}
	,{
		title: 'category'
		,waitForElementVisible: '#wrapper'
		,elementPresent: '#nav'
		,containsText: ['h1', 'default category']
		,elementCount: ['h2', 1]
		,url: 'http://127.0.0.1:' + port + '/cat/default'
	}
	,{
		title: 'single post'
		,waitForElementVisible: '#wrapper'
		,elementPresent: '#nav'
		,containsText: ['h1', 'hello, jadepress!']
		,elementCount: ['h1', 1]
		,url: 'http://127.0.0.1:' + port + '/default/hello-slug'
	}
	,{
		title: '404'
		,waitForElementVisible: '#wrapper'
		,elementPresent: '#wrapper'
		,containsText: ['h1', '404.']
		,elementCount: ['h1', 1]
		,url: 'http://127.0.0.1:' + port + '/ggg'
	}
	,{
		title: 'search - no result'
		,waitForElementVisible: '#wrapper'
		,elementPresent: '#nav'
		,containsText: ['h1', 'search']
		,elementCount: ['h1', 1]
		,url: 'http://127.0.0.1:' + port + '/s?title=dddd'
	}
	,{
		title: 'search - has result'
		,waitForElementVisible: '#wrapper'
		,elementPresent: '#nav'
		,containsText: ['h1', 'search hello']
		,elementCount: ['h2', 1]
		,url: 'http://127.0.0.1:' + port + '/s?title=hello'
	}
]
