'use strict';

var Promise         = require('bluebird'),
    QueryFactory    = require('../../queryFactory'),
    Constants       = require('../../constants'),
    ENDPOINT        = {
        method  : 'GET',
        url     : Constants.API_BASE_URL + '/analytics/v3/data/mcf'
    },
    mcf;

mcf = function(queryParams, accessToken, clientId) {

    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');
    if (typeof clientId === 'undefined')    throw new Error('clientId is missing');

    return new Promise(function(resolve, reject) {
        var googleAnalyticsQuery = new QueryFactory.createCredentialedQuery(ENDPOINT.method, ENDPOINT.url, queryParams, {}, accessToken, clientId);
        googleAnalyticsQuery.runAsync()
            .spread(function(response, json) {
                resolve([response, json]);
            })
            .catch(function(error) {
                console.log(error);
                reject(error);
            });
    });
};

module.exports = mcf;
