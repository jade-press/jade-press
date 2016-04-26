
/*login*/

;(function () {
	var $alert = Vue.$alert
	var app = new Vue({
		el: 'body'
		,data: {
			loaded: true
			,formData: {

			}
			,form1: null
			,errCount: 0
			,onSubmit: false
			,captchaHtml: ''
		}
		,methods: {

			checkNavBar: function() {
				//collapse button
				if(!$('.navbar-toggler').is(':visible')) $('#menus').addClass('in')
				else $('#menus').removeClass('in')
			}
			,formHook2: function(fm2) {
				this._form2 = fm2
			}
			,setDirty: function() {
				this._form2.setDirty()
			}
			,refreshCaptcha: function(url) {
				this.captchaHtml = '<img alt="" src="' + 
				(url || h5.host + '/captcha') + 
				'?' + new Date().getTime() + '" />'
			}

			,submit: function() {
				var pi = this
				if(pi.onSubmit) return
				if(pi.form1.$invalid) return this.setDirty()
				if(!pi.form1.$invalid) {
					pi.onSubmit = true
					$.ajax({
						type: 'post'
						,url: h5.host + '/login'
						,data: pi.formData
					})
					.then(ok, err)
				}

				function ok(res) {
					pi.onSubmit = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg')
						pi.errCount = data.errCount
						pi.refreshCaptcha()
					}
					else {
						location.href = data.redirect
					}
					
				}

				function err(res) {
					pi.onSubmit = false
					$alert('login failed', 'danger', '#msg')
				}
			}
		}
	})


})()