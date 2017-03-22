'use strict';

var CONSTANTS   = require('../../constants'),
	ENDPOINTS   = {
		query: CONSTANTS.API_BASE_URL + '/webmasters/v3/sites/{{siteUrl}}/searchAnalytics/query'
	};


function SearchAnalytics(ctx) {
	this.ctx = ctx;
}

SearchAnalytics.prototype.query = function(siteUrl, queryParams) {
	var headers = {
		'User-Agent'    : 'google-api-client',
		'host'          : 'www.googleapis.com'
	};
	var query = this.ctx.ApiQuery('POST', ENDPOINTS.query, { siteUrl: siteUrl }, queryParams, headers, null, { json: true, rawResponse: true });
	return new Promise(function(resolve, reject) {
		query()
		.then(function(result){
			resolve(result.rows);
		})
		.catch(function(error) {
			reject(error);
		})
	});
};

module.exports = SearchAnalytics;
