


;(function () {

	var $alert = Vue.$alert
	var app = new Vue({
		el: 'body'
		,data: {
			loaded: true
			,form1: null
			,formData1: {
			}
			,onSubmit1: false
			,captchaHtml: ''

		}
		,methods: {

			formHook: function(fm2) {
				this._form = fm2
			}
			,setPristine: function() {
				var pi = this
				Vue.nextTick(function() {
					pi._form.setPristine()
				})
			}
			,setDirty: function() {
				this._form.setDirty()
			}
			,refreshCaptcha: function(url) {
				this.captchaHtml = '<img alt="" src="' + 
				(url || h5.host + '/captcha') + 
				'?' + new Date().getTime() + '" />'
			}
			,update: function() {
				var pi = this
				if(pi.onSubmit1) return
				if(pi.form1.$invalid) return this.setDirty()
				pi.onSubmit1 = true
				$.ajax({
					type: 'post'
					,url: h5.host + '/reset-password-apply'
					,data: pi.formData1
				})
				.then(function(res) {
					pi.onSubmit1 = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg2')			
					} else {
						
						pi.setPristine()
						$alert('done, a email has been sent to <mark>' + pi.formData1.email + '</mark>', 'success', '#msg2', 10000)
						pi.refreshCaptcha()
						pi.formData1 = {}
					}
					
				}, function(res) {
					pi.onSubmit1 = false
					pi.refreshCaptcha()
					$alert('operation failed', 'danger', '#msg2')
				})

				//end func
			}

			//end methods
		}

	})

	app.refreshCaptcha()

})()