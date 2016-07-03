
'use strict'

let
ugly = require('gulp-uglify')
,fs = require('fs')
,path = require('path')
,gulp = require('gulp')
,watch = require('gulp-watch')
,plumber = require('gulp-plumber')
,newer = require('gulp-newer')
,stylus = require('gulp-stylus')
,concat = require('gulp-concat')
,rename = require('gulp-rename')
,runSequence = require('run-sequence')
,_ = require('lodash')
,exec = require('child_process').exec

let
cssFolder = __dirname + '/public/css'
,jsFolder = __dirname + '/public/js'
,onces = [
	__dirname + '/bower_components/blueimp-file-upload/js'
	,__dirname + '/bower_components/blueimp-file-upload/js/vendor'
]
,config = require( process.cwd() + '/config' )
,stylusOptions = {
	compress: true
}
,uglyOptions = {
	mangle: {
		except: ['exports', 'module', 'require']
	}
}

gulp.task('stylus', function() {

	gulp.src(cssFolder + '/*.styl')
		
/*		.pipe(newer({
			dest: cssFolder
			,map: function(path) {
				return path.replace(/\.styl$/, '.css')
			}
		}))*/
		.pipe(plumber())
		.pipe(stylus(stylusOptions))
		.pipe(gulp.dest(cssFolder))

})


gulp.task('ugly', function() {

		gulp.src(jsFolder + '/*.js')
			.pipe(newer({
				dest: jsFolder
				,map: function(path) {
					return path.replace(/\.dev.js$/, '.min.js')
				}
			}))
			.pipe(plumber())
			.pipe(rename(function (path) {
				path.basename = path.basename.replace('.dev', '')
				path.extname = path.extname.replace('.js', '.min.js')
			}))
			.pipe(gulp.dest(jsFolder))
			.pipe(ugly(uglyOptions))
			.pipe(gulp.dest(jsFolder))

})

gulp.task('svg', function() {


	const reader = require('svg-reader')
	const resolve = path.resolve
	const iconsPath = resolve(__dirname, 'public/font/jade-press.svg')
	var icons = reader( iconsPath )

	var iconsObj = Object.keys(icons).reduce(function(prev, iconName) {
		prev[iconName] = icons[iconName].svg
		return prev
	}, {})

	var str = JSON.stringify(iconsObj)

	var localStr = fs.readFileSync('app/local.js', 'utf-8')
	localStr = localStr.replace(/\/\/icons\s+.+\s+\/\/icons/, '//icons\n' + str + '\n\t\t//icons')

	fs.writeFileSync('app/local.js', localStr)


})


gulp.task('ugly-vender', function() {

	onces.forEach(function(fpath) {
		console.log('x')
		gulp.src(fpath + '/*.js')
			.pipe(plumber())
			.pipe(rename(function (path) {
				console.log(path)
				path.extname = path.extname.replace('.js', '.min.js')
			}))
			.pipe(gulp.dest(fpath))
			.pipe(ugly(uglyOptions))
			.pipe(gulp.dest(fpath))
	})

})

gulp.task('watch',  function () {

	watch([cssFolder + '/*.styl', cssFolder + '/parts/*.styl'], function() {
		runSequence('stylus')
	})

	watch(jsFolder + '/*.dev.js', function() {
		runSequence('ugly')
	})

	watch('./public/font/*.svg', function() {
		runSequence('svg')
	})

})


let plugins = config.setting.plugins
let pluginsArr = Object.keys(plugins)
if(config.setting.theme && !config.setting.theme.name) pluginsArr.push(config.setting.theme)
let tasks = []
pluginsArr.forEach(function(v) {
	tasks.push('npm-install-plugin-' + v)
	tasks.push('bower-install-plugin-' + v)
})

pluginsArr.forEach(function(pln) {


	gulp.task('npm-install-plugin-' + pln, function(cb) {

		let name = pln
		let ver = plugins[name]
		let ext = ''

		if(
			/^(\.{1,2})?\//.test(ext) ||
			/\:/.test(ext) ||
			/\//.test(ext)
		) ext = ver

		else ext = name + '@' + (ver || '*')

		exec('npm install ' + ext, function (err, stdout, stderr) {
			console.log(stdout)
			console.error(stderr)
			cb(err)
		})

	})

	gulp.task('bower-install-plugin-' + pln, function(cb) {

		let name = pln
		let ver = plugins[name]
		let ext = ''

		//if(ver === '*') ver = 'latest'

		if(
			/^(\.{1,2})?\//.test(ext) ||
			/\:/.test(ext) ||
			/\//.test(ext)
		) ext = ver

		else ext = name + '#' + ver

		exec('bower install ' + ext, function (err, stdout, stderr) {
			console.log(stdout)
			console.error(stderr)
			cb(null)
		})

	})

})


gulp.task('default', ['watch'])
gulp.task('dist', function() {
	runSequence('stylus', 'ugly')
})
gulp.task('install', function() {
	runSequence(tasks)
})