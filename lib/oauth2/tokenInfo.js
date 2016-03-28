'use strict';

var Promise = require('bluebird'),
    QueryFactory = require('../queryFactory'),
    Constants = require('../constants'),
    ResponseUtil = require('../utils/responseUtil'),
    ENDPOINT = {
        method  : 'GET',
        url     : Constants.API_BASE_URL + '/oauth2/v3/tokeninfo'
    },

    tokenInfo;

tokenInfo = function(accessToken) {
    return new Promise(function(resolve, reject) {
        if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');
        var queryParams = {
            'access_token': accessToken
        };
        var query = QueryFactory.createQuery(ENDPOINT.method, ENDPOINT.url, queryParams);
        query.runAsync()
        .spread(function(response, body) {
            resolve(ResponseUtil.parseResponse(response, body));
        })
        .catch(function(error) {
            reject(error);
        });
    });
};

module.exports = tokenInfo;
