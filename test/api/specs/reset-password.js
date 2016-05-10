
module.exports = function(host) {

	return {

		title: 'reset password'
		,tests: [

			{
				title: 'password format not right'
				,options:{
					url: host + '/reset-password'
					,method: 'post'
					,body: {
						password: '123456'
					}
					,jar: true
					,json: true
				}
				
				,expect: {
					code: 1
					,errFields: ['password']
					,errs: ['password:custom validation fail;']
				}
			}
			,{
				title: 'password format right'
				,options:{
					url: host + '/reset-password'
					,method: 'post'
					,body: {
						password: '123456a'
					}
					,jar: true
					,json: true
				}
				
				,expect: {
					code: 0
					,redirect: host
				}
			}

		]

	}

}