'use strict';

var Promise = require('bluebird'),
    request = Promise.promisify(require('request'), { multiArgs: true }),
    Constants = require('../constants'),
    QueryFactory = require('../queryFactory'),
    ResponseUtil = require('../utils/responseUtil'),
    ENDPOINT = {
        method  : 'POST',
        url     : Constants.API_BASE_URL + '/oauth2/v4/token'
    },
    token;

token = function(refreshToken, clientId, clientSecret) {

    if (typeof refreshToken === 'undefined')    throw new Error('refreshToken is missing');
    if (typeof clientId === 'undefined')        throw new Error('clientId is missing');
    if (typeof clientSecret === 'undefined')    throw new Error('clientSecret is missing');

    return new Promise(function(resolve, reject) {
        var queryParams = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret
        };

        var headers = {
            'Content-Type':'application/x-www-form-urlencoded'
        };

        var query = QueryFactory.createQuery(ENDPOINT.method, ENDPOINT.url, queryParams, headers);
        query.runAsync()
        .spread(function(response, body) {
            resolve(ResponseUtil.parseResponse(response, body));
        })
        .catch(function(error) {
            reject(error);
        });
    });
};

module.exports = token;
