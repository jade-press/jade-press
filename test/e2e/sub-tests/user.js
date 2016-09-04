'use strict'

let config = require('../config')
let host = 'http://127.0.0.1:' + config.port
let testTab = require('../section-tests/tab')

//sub test for main
module.exports = function($) {

    let browser = $

    $

    //url
        .click('#nav a[href="' + host + '/admin/user"]')
        .waitForElementVisible('#nav a.active[href="' + host + '/admin/user"]', 1500)
        .assert.urlContains('user')

    //tab
    testTab($, '#new', 'form[name=form2]')
    testTab($, '#list', 'form[name=form1]')

    //default list count
    $
        .assert.elementCount('.list-group-item', 1)

    //search no result
    .setValue('form[name=form1] input[name=name]', '111')
        .click('form[name=form1] button[type="submit"]')
        .pause(300)
        .assert.elementCount('.list-group-item', 0)

    //search 1 result
    .clearValue('form[name=form1] input[name=name]')
        .setValue('form[name=form1] input[name=name]', 'admin')
        .click('form[name=form1] button[type="submit"]')
        .pause(300)
        .assert.elementCount('.list-group-item', 1)

    //search no result email:xxx
    .clearValue('form[name=form1] input[name=name]')
        .setValue('form[name=form1] input[name=email]', 'xxx')
        .click('form[name=form1] button[type="submit"]')
        .pause(300)
        .assert.elementCount('.list-group-item', 0)

    //search 1 result email:admin
    .clearValue('form[name=form1] input[name=email]')
        .setValue('form[name=form1] input[name=email]', 'admin')
        .click('form[name=form1] button[type="submit"]')
        .pause(300)
        .assert.elementCount('.list-group-item', 1)

    //group select no result
    .click('form[name=form1] select')
        .keys($.Keys.ARROW_DOWN)
        .keys($.Keys.ARROW_DOWN)
        .keys($.Keys.ENTER)
        .click('form[name=form1] button[type="submit"]')
        .pause(400)
        .assert.elementCount('.list-group-item', 0)

    //group select 1 result
    .click('form[name=form1] select')
        .keys($.Keys.ARROW_UP)
        .keys($.Keys.ENTER)
        .click('form[name=form1] button[type="submit"]')
        .pause(400)
        .assert.elementCount('.list-group-item', 1)

    //new user
    testTab($, '#new', 'form[name=form2]')

    //form
    $.setValue('form[name=form2] input[name=name]', 'kk')
        .clearValue('form[name=form2] input[name=name]', function() {
            $.assert.elementCount('.alert.alert-danger:visible', 2)
        })
        .setValue('form[name=form2] input[name=name]', Array(51).fill('p').join(''), function() {
            $.getValue('form[name=form2] input[name=name]', function(result) {
                this.assert.equal(result.value, Array(50).fill('p').join(''))
            })
        })

    .clearValue('form[name=form2] input[name=name]')
        .setValue('form[name=form2] input[name=name]', 'test1', function() {
            $.assert.elementCount('.alert.alert-danger:visible', 1)
        })

    //password
    .setValue('form[name=form2] input[name=password]', '12345677', function() {
            $.assert.elementCount('.alert.alert-danger:visible', 2)
        })
        .clearValue('form[name=form2] input[name=password]', function() {
            $.assert.elementCount('.alert.alert-danger:visible', 2)
        })
        .setValue('form[name=form2] input[name=password]', '123456a')

    //submit fail
    .click('form[name=form2] button[type="submit"]', function() {
        $.assert.elementCount('.alert.alert-danger:visible', 2)
    })

    //email
    .setValue('form[name=form2] input[name=email]', '12345677', function() {
            $.assert.elementCount('.alert.alert-danger:visible', 2)
        })
        .clearValue('form[name=form2] input[name=email]', function() {
            $.assert.elementCount('.alert.alert-danger:visible', 2)
        })
        .setValue('form[name=form2] input[name=email]', 'xx@dd.jj', function() {
            $.assert.elementCount('.alert.alert-danger:visible', 1)
        })

    //submit fail
    .click('form[name=form2] button[type="submit"]', function() {
        $.assert.elementCount('.alert.alert-danger:visible', 1)
    })

    //select user group
    .jqueryClick('form[name=form2] .accesses .btn:first', function() {
        $.assert.elementCount('.alert.alert-danger:visible', 0)
    })

    //submit again
    .click('form[name=form2] button[type="submit"]')

    //success alert
    .waitForElementPresent('form[name=form2] .alert.alert-success', 1500)

    //reset form
    .getValue('form[name=form2] input[name=name]', function(result) {
        this.assert.equal(result.value, '')
    })

    //list count
    .assert.elementCount('.list-group-item', 2)

    //user-list
    require('./user-list')($)


}