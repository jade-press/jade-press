'use strict'

let config = require('../config')
,port = config.port
,host = 'http://127.0.0.1:' + port
,tests = [
	{
		title: 'work-flow'
		,waitForElementVisible: '#wrapper'
		,elementPresent: 'h1'
		,containsText: ['.btn-link', 'forget password']
		,elementCount: ['h1', 1]
		,url: 'http://127.0.0.1:' + port + '/login'
	}
]
//disable
exports['@disabled'] = 0

tests.forEach(function(test) {

	exports[test.title] = function(browser) {

		browser
			.url(test.url)
			.assert.elementPresent(test.elementPresent)
			.assert.containsText(test.containsText[0], test.containsText[1])
			.assert.elementCount(test.elementCount[0], test.elementCount[1])
			.click('button[type="submit"]', function() {
				browser.assert.elementCount('.alert.alert-danger:visible', 1)
			})
			.setValue('input[type=email]', 'xxxx@gg.kk', function() {
				browser.assert.elementCount('.alert.alert-danger:visible', 0)
			})
			.clearValue('input[type=email]')
			.setValue('input[type=email]', 'admin@example.com')
			.setValue('input[type=password]', '12345', function() {
				browser.assert.elementCount('.alert.alert-danger:visible', 1)
			})
			.clearValue('input[type=password]')
			.setValue('input[type=password]', '123456a', function() {
				browser.assert.elementCount('.alert.alert-danger:visible', 0)
			})
			.click('button[type="submit"]')
			.pause(1000)

			//now in reset-password page
			require('../sub-tests/reset-password')(browser)

			//now in /admin/main
			require('../sub-tests/main')(browser)

			//now in /admin/group new user group
			require('../sub-tests/user-groups1')(browser)

			//now in /admin/group edit user group
			require('../sub-tests/user-groups2')(browser)

			//now in /admin/file
			require('../sub-tests/files')(browser)

			//now in /admin/user
			require('../sub-tests/user')(browser)

			//now in /admin/cat
			require('../sub-tests/cat')(browser)

			//now in /admin/post
			require('../sub-tests/post')(browser)

			//end
			browser.end()
	}
	
})

