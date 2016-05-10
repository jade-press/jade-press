
module.exports = function(host) {

	return {

		title: 'login'
		,tests: [
			{
				options:{
					url: host + '/login'
					,method: 'post'
					,body: {
						email: 'admin@example.com88'
						,password: '123456a'
					}
					,jar: true
					,json: true
				}
				,title: 'login fail'
				,expect: {
					code: 1
					,errorMsg: 'email or password not right'
					,errorField: 'id'
					,errCount: 1
				}
			}
			,{
				options:{
					url: host + '/login'
					,method: 'post'
					,body: {
						email: 'admin@example.com'
						,password: '123456a0'
					}
					,jar: true
					,json: true
				}
				,title: 'login success'
				,expect: {
					code: 0
					,redirect: host + '/admin/main'
				}
			}

		]

	}

}