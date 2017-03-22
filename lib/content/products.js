'use strict';

var CONSTANTS   = require('../constants'),
	Api         = require('../api'),
	Util        = require('../util'),
	MAX_RESULTS = 250,
	GOOGLE_PRODUCT_CONTENT  = 'content#product',
	ENDPOINTS   = {
		get: {
			v2: CONSTANTS.API_BASE_URL + '/content/v2/{{merchantId}}/products/{{productId}}'
		},
		insert: {
			v2: CONSTANTS.API_BASE_URL + '/content/v2/{{merchantId}}/products'
		},
		list: {
			v2: CONSTANTS.API_BASE_URL + '/content/v2/{{merchantId}}/products'
		}
	};

function Products(credentials, version) {
//	this.setCredentials(credentials, version);
}

Products.inherits(Api);

Products.prototype.get = function(merchantId, productId) {
	var url = ENDPOINTS.get[this.version],
	    query = this.getClient().ApiQuery('GET', url, {merchantId: merchantId, productId: productId});
	return query();
};

Products.prototype.insert = function(merchantId, product) {
	product.kind = GOOGLE_PRODUCT_CONTENT;
	var url = ENDPOINTS.insert[this.version],
		query = this.getClient().ApiQuery('POST', url, {merchantId: merchantId}, product, {}, undefined, { rawResponse : true });
	return query();
};

/**
 *
 * @param merchantId
 * @param options
 * @param options.firstPageOnly
 * @returns {Promise}
 */
Products.prototype.list = function(merchantId, options) {
	var url = ENDPOINTS.list[this.version],
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
			var query = self.getClient().ApiQuery('GET', url, {merchantId: merchantId}, queryParams);
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

module.exports = Products;