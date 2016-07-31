

const stylus = require('stylus')

module.exports = function(str) {
	return new Promise(function(resolve, reject) {
		stylus.render(str, function(err, css){
			if(err) reject(err)
			else resolve(css)
		})
	})
}
