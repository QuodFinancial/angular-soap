var withCredentials = false;

angular.module('angularSoap', [])

.provider("$soap", function $soapProvider() {
	var logsActivated = false;

	this.activateLogs = function activateLogs() {
		logsActivated = true;
	};

	/**
	 * Call activateCrossSite() to use credentials on cross-site Access-Control requests.
	 */
	this.activateCrossSite = function activateCrossSite() {
		withCredentials = true;
	}

	this.$get = ['$q',function($q){
		return {
			post: function(url, action, params){
				var deferred = $q.defer();

				//Create SOAPClientParameters
				var soapParams = new SOAPClientParameters();
				for(var param in params){
					soapParams.add(param, params[param]);
				}

				//Create Callback
				var soapCallback = function(e){
					if(e && e.constructor.toString().indexOf("function Error()") != -1){
						deferred.reject("An error has occurred.");
					} else {
						deferred.resolve(e);
					}
				}

				// Log conditionnaly the params
				if (logsActivated) {
					console.log(url, action, params);
				}

				SOAPClient.invoke(url, action, soapParams, true, soapCallback, withCredentials);

				return deferred.promise;
			},
			setCredentials: function(username, password){
				SOAPClient.username = username;
				SOAPClient.password = password;
			}
		}
	}];
});
