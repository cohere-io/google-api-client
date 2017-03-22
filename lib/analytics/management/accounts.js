'use strict';

var CONSTANTS   = require('../../constants'),
	ENDPOINTS   = {
		list: CONSTANTS.API_BASE_URL + '/analytics/v3/management/accounts'
	};

function Accounts(ctx) {
	this.ctx = ctx;
}

Accounts.prototype.list = function() {
	var query = this.ctx.ApiQuery('GET', ENDPOINTS.list);
	return query();
};

module.exports = Accounts;