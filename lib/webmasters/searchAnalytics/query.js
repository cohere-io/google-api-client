'use strict';

var Promise         = require('bluebird'),
    Constants       = require('../../constants'),
    QueryFactory    = require('../../queryFactory'),
    ResponseUtil    = require('../../utils/responseUtil'),
    ENDPOINT        = {
        method  : 'POST',
        url     : Constants.API_BASE_URL + '/webmasters/v3/sites/{{siteUrl}}/searchAnalytics/query'
    },

    query;

query = function(siteUrl, queryParams, accessToken, clientId) {

    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');
    if (typeof queryParams === 'undefined') throw new Error('queryParams are missing');
    if (typeof siteUrl === 'undefined') throw new Error('siteUrl is missing');

    var self = this;

    return new Promise(function(resolve, reject) {
        var url = ENDPOINT.url.replace('{{siteUrl}}', encodeURIComponent(siteUrl));
        var headers = {
            'User-Agent' : 'google-api-client',
            'host': 'www.googleapis.com'
        };
        var query = QueryFactory.createAuthorizedQuery(ENDPOINT.method, url, queryParams, headers, accessToken);
        query.runAsync({postJson: true})
        .spread(function(response, body) {
            resolve(ResponseUtil.parseResponse(response, body));
        })
        .catch(function(err) {
            console.log(err);
            reject(err);
        });
    });
};

module.exports = query;
