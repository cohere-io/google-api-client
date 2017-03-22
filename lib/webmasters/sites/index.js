'use strict';

var CONSTANTS = require('../../constants'),
    ENDPOINTS   = {
        list: CONSTANTS.API_BASE_URL + '/webmasters/v3/sites/',
        get: CONSTANTS.API_BASE_URL + '/webmasters/v3/sites/{{siteUrl}}'
    };

function Sites(ctx) {
	this.ctx = ctx;
}

Sites.prototype.list = function() {
	var query = this.ctx.ApiQuery('GET', ENDPOINTS.list);
	return query();
};

Sites.prototype.get = function(siteUrl) {
    var substitutions = {
        siteUrl: siteUrl
    };
    var query = this.ctx.ApiQuery('GET', ENDPOINTS.get, substitutions);
    return query();
};

module.exports = Sites;
