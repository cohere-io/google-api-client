'use strict';

var CONSTANTS   = require('../constants'),
	Api         = require('../api'),
	Util        = require('../util'),
	MAX_RESULTS = 250,
	ENDPOINTS = {
	get: CONSTANTS.API_BASE_URL + '/content/v2/{{merchantId}}/productstatuses/{{productId}}',
	list : CONSTANTS.API_BASE_URL + '/content/v2/{{merchantId}}/productstatuses'
};

function ProductStatuses(ctx) {
	this.ctx = ctx;
}

ProductStatuses.inherits(Api);

ProductStatuses.prototype.get = function(merchantId, productId) {
	var url = ENDPOINTS.get;
	var query = this.ctx.client.ApiQuery('GET', url, {merchantId: merchantId, productId: productId});
	return query();
};

ProductStatuses.prototype.list = function(merchantId, options) {

	var url = ENDPOINTS.list,
		self = this;

	options || (options = {});

	return new Promise(function(resolve, reject) {
		var scope = {},
			first = true;

		scope.rows = [];

		Util.promiseWhile(function () {
			// pagination
			return first || scope.nextPageToken;
		}, function () {
			first = false;
			var queryParams = { maxResults: MAX_RESULTS };
			if (scope.nextPageToken) {
				queryParams.pageToken = scope.nextPageToken;
			}
			var query = new self.ctx.ApiQuery('GET', url, {merchantId: merchantId}, queryParams);
			return query()
			.then(function (results) {
				scope.nextPageToken = results.nextPageToken;
				results.resources.forEach(function (result) {
					scope.rows.push(result);
				});
				if (options.firstPageOnly) {
					scope.nextPageToken = undefined;
				}
			})
		})
		.then(function() {
			resolve(scope.rows);
		})
		.catch(function(error) {
			reject(error);
		})
	})
};


module.exports = ProductStatuses;
