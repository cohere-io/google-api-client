'use strict';

var CONSTANTS = require('../constants'),
	Api         = require('../api'),
	ENDPOINTS = {
		authinfo: {
			v2: CONSTANTS.API_BASE_URL + '/content/v2/accounts/authinfo'
		},
		get: {
			v2: CONSTANTS.API_BASE_URL + '/content/v2/{{merchantId}}/accounts/{{accountId}}'
		}
	};

function Accounts(clientId, version) {
//	this.setCredentials(credentials, version);
}

Accounts.inherits(Api);

Accounts.prototype.authinfo = function() {

	var url = ENDPOINTS.authinfo[this.version];

	var query = this.getClient().ApiQuery('GET', url);
	return query();

};

Accounts.prototype.get = function(merchantId, accountId) {

	var url = ENDPOINTS.get[this.version];

	var substitutions = {
		merchantId : merchantId,
		accountId : accountId
	};

	var query = this.getClient().ApiQuery('GET', url, substitutions);
	return query();

};

module.exports = Accounts;