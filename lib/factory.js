'use strict';

var Promise         = require('bluebird'),
	PromiseQueue    = require('promiseq'),
	request         = Promise.promisify(require('request'), { multiArgs: true }),
	_               = require('lodash'),
	MAX_CONCURRENT_QUERIES = 10,
	RESULTS_PER_PAGE = 10000;

// require('request').debug = true;

Promise.promisifyAll(request);

function Builder(clientId) {
	this._clientId = clientId;
}

Builder.prototype.getClientId = function() {
	return this._clientId;
};

Builder.prototype.setAccessToken = function(accessToken) {
	this._accessToken = accessToken;
};

Builder.prototype.getAccessToken = function() {
	return this._accessToken;
};

Builder.prototype.ApiQuery = function(method, url, substitutions, queryParams, headers, callback, options) {
	return _apiQuery(this, method, url, substitutions, queryParams, headers, callback, options);
};

Builder.prototype.PaginatedApiQuery = function(method, url, substitutions, queryParams, headers, callback, options) {

	options || (options = {});
	queryParams = queryParams || {};
	queryParams.limit = RESULTS_PER_PAGE;

	var scope = {},
		self = this;

	scope.rows = [];

	var callback = (function (rows) {
		return function (body) {
			for (var i = 0; body.rows && i < body.rows.length; i++) {
				rows.push(body.rows[i]);
			}
		}
	})(scope.rows);

	return new Promise(function (resolve, reject) {
		var query = self.ApiQuery(method, url, substitutions, queryParams, headers, callback);
		query()
		.then(function (body) {
			// TODO - add alert for queries that contain sample data
			// console.log('**** CONTAINS SAMPLED DATA : ' + body.containsSampledData);
			if (options.firstPageOnly) {
				return;
			}
			// console.log('**** TOTAL RESULTS : ' + body.totalResults);
			var numPages;
			if (options.calcNumPages) {
				numPages = options.calcNumPages(body);
			} else {
				numPages = Math.floor(body.totalResults / RESULTS_PER_PAGE) + (body.totalResults % RESULTS_PER_PAGE > 0 ? 1 : 0);
			}

			var itemsPerPage;
			if (options.calcItemsPerPage) {
				itemsPerPage = options.calcItemsPerPage(body);
			} else {
				itemsPerPage = RESULTS_PER_PAGE;
			}

			var queue = new PromiseQueue(options.maxConcurrentQueries || MAX_CONCURRENT_QUERIES);
			for (var i = 1; i < numPages; i++) {
				var pageParams = {};
				if (options.addPageParams) {
					pageParams = addPageParams(i + 1, queryParams);
				} else {
					_.assign(pageParams, queryParams, {'start-index': i * RESULTS_PER_PAGE});
				}
				queue.push(self.ApiQuery(method, url, substitutions, pageParams, headers, callback));
			}

			return queue.close();

		}).then(function () {
			// console.log('**** TOTAL ROWS : ' + scope.rows.length);
			resolve(scope.rows);
		})
		.catch(function (error) {
			console.trace(error);
			reject(error);
		});
	});
};

var _apiQuery = function (ctx, method, url, substitutions, queryParams, headers, callback, options) {

	return function() {

		method || (method = 'GET');
		substitutions || (substitutions = {});
		queryParams || (queryParams = {});
		headers || (headers = {});
		options || (options = {});

		if (ctx._accessToken) {
			headers.Authorization = 'Bearer ' + ctx._accessToken;
		}

		return new Promise(function(resolve, reject) {

			var func;

			var requestParams = { method: method };

			switch (method) {
				case 'GET':
					requestParams.qs = queryParams;
					requestParams.client_id = ctx._clientId;
					func = request.getAsync;
					break;
				case 'POST':
					if (options.json) {
						headers['Content-Type'] = 'application/json';
						requestParams.json = queryParams;
					} else {
						headers['Content-Type'] = 'application/x-www-form-urlencoded';
						requestParams.qs = queryParams;
					}
					func = request.postAsync;
					break;
			}

			requestParams.headers = headers;
			requestParams.url = _endpoint(url, substitutions);
			console.log(requestParams.url);
			//url = _endpoint(url, substitutions, queryParams);
			if (options.debug) { console.log(requestParams.url) }
			// console.log(requestParams);
			// console.log(func);
			// request.getAsync(url, requestParams)
			if (options.debug) { console.log(requestParams); }
			func(requestParams)
			.then(function(response) {
				if (response.statusCode !== 200) {
					// bad response OR the response was rejected because of bad auth
					// this happens on a tokeninfo with an expired accessToken
					reject((response.body || {}).error || response.body);
				} else {
					var result = options.rawResponse ? response.body : JSON.parse(response.body);
					if (options.debug) {
						console.log(result);
					}
					callback && callback(result);
					resolve(result);
				}
			})
			.catch(function(error) {
				console.log(error);
				reject(error);
			});
		});
	}

};

var _endpoint = function(url, substitutions, queryParams) {
	var params = [];
	substitutions || (substitutions = {});
	queryParams || (queryParams = {});
	Object.keys(substitutions).forEach(function(key) {
		var regex = "{{" + key + "}}";
		url = url.replace(new RegExp(regex), encodeURIComponent(substitutions[key]));
	});
	Object.keys(queryParams).forEach(function(key) {
		params.push(encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
	});
	if (params.length > 0) {
		url = url + '?' + params.join('&');
	}

	return url;
};

module.exports = {
	Builder: Builder
};
