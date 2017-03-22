'use strict';

var _           = require('lodash'),
	CONSTANTS   = require('../../constants'),
    ENDPOINTS   = {
        get: CONSTANTS.API_BASE_URL + '/analytics/v3/data/ga',
	    getAll: CONSTANTS.API_BASE_URL + '/analytics/v3/data/ga'
    },
	MAX_RESULT_SET_SIZE     = 10000;

function Data(ctx) {
	this.ctx = ctx;
}

Data.prototype.get = function (queryParams) {
	var query = this.ctx.ApiQuery('GET', ENDPOINTS.get, {}, queryParams);
	return query();
};

Data.prototype.getAll = function(queryParams) {
	_.merge(queryParams, { 'max-results' : MAX_RESULT_SET_SIZE });
	return this.ctx.PaginatedApiQuery('GET', ENDPOINTS.get, {}, queryParams);
};

module.exports = Data;
