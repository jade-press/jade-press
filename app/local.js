const packageInfo = require('../package.json')
const read = require('svg-reader')
const iconsPath = require('path').resolve(__dirname, '../public/font/jade-press.svg')
const icons = read(iconsPath)
const iconsObj = Object.keys(icons).reduce(function(prev, iconName) {
    prev[iconName] = icons[iconName].svg
    return prev
}, {})

module.exports = {
    siteName: 'jadepress',
    siteDesc: 'jade-press',
    version: packageInfo.version,
    jadepress: 'http://jadepress.org',
    siteKeywords: 'jade-press',
    pageSize: 20,
    maxLink: 5,
    icons: iconsObj
}