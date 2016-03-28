'use strict';

var Promise         = require('bluebird'),
    Constants       = require('../../../constants'),
    QueryFactory    = require('../../../queryFactory'),
    ENDPOINT    = {
        method  : 'GET',
        url     : Constants.API_BASE_URL + '/analytics/v3/management/accounts'
    },
    list;

list = function(accessToken, clientId) {

    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');
    if (typeof clientId === 'undefined')    throw new Error('clientId is missing');

    return new Promise(function(resolve, reject) {
        var query = QueryFactory.createCredentialedQuery(ENDPOINT.method, ENDPOINT.url, {}, {}, accessToken, clientId);
        query.runAsync()
        .then(function(result) {
            var response = result[0];
            var body = result[1];
            resolve(body);
        })
        .catch(function(err) {
            console.log(err);
            reject(err);
        });
    });
};

module.exports = list;
