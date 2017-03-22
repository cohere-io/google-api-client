'use strict';

var CONSTANTS = require('../constants'),
    ENDPOINTS = {
        token : CONSTANTS.API_BASE_URL + '/oauth2/v4/token',
	    tokenInfo: CONSTANTS.API_BASE_URL + '/oauth2/v3/tokeninfo'
    };

function OAuth2(ctx) {
    this.ctx = ctx;
}

OAuth2.prototype.token = function(refreshToken, clientSecret) {
	var queryParams = {
		grant_type: 'refresh_token',
		client_id: this.ctx.getClientId(),
		refresh_token: refreshToken,
		client_secret: clientSecret
	};
	var query = this.ctx.ApiQuery('POST', ENDPOINTS.token, {}, queryParams);
	return query();
};

OAuth2.prototype.refreshToken = function(refreshToken, clientSecret) {
	var queryParams = {
		grant_type: 'refresh_token',
		client_id: this.ctx.getClientId(),
		refresh_token: refreshToken,
		client_secret: clientSecret
	};
	var query = this.ctx.ApiQuery('POST', ENDPOINTS.token, {}, queryParams);
	return new Promise(function(resolve, reject) {
		query()
		.then(function(result) {
			resolve(result.access_token);
		})
		.catch(function(error) {
			console.log(error);
			reject(error);
		})
	});
};

OAuth2.prototype.tokenInfo = function(accessToken) {
	var qp = { access_token : accessToken };
	var query = this.ctx.ApiQuery('GET', ENDPOINTS.tokenInfo, {}, qp);
	return new Promise(function(resolve, reject) {
		query()
		.then(function(result) {
			resolve(result);
		})
	});
};

OAuth2.prototype.isTokenValid = function(accessToken) {
	var qp = { access_token : accessToken };
	var query = this.ctx.ApiQuery('GET', ENDPOINTS.tokenInfo, {}, qp);
	return new Promise(function(resolve, reject) {
		query()
		.then(function(result) {
			resolve(result && result.expires_in && result.expires_in > -1);
		})
		.catch(function(error) {
			if (typeof error !== 'string') {
				reject(error);
			} else {
				try {
					error = JSON.parse(error);
				} catch (e) {
					reject(error);
				}
				if ((error || {}).error_description === 'Invalid Value') {
					resolve(false);
				} else {
					reject(error);
				}
			}
		})
	});
};

module.exports = OAuth2;
