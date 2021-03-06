'use strict';

var Promise         = require('bluebird'),
    Constants       = require('../../constants'),
    QueryFactory    = require('../../queryFactory'),
    ResponseUtil    = require('../../utils/responseUtil'),
    ENDPOINT = {
        method  : 'GET',
        url     : Constants.API_BASE_URL + '/webmasters/v3/sites/{{siteUrl}}/urlCrawlErrorsSamples'
    },

    list;

list = function(siteUrl, category, platform, accessToken) {

    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');
    if (typeof siteUrl === 'undefined') throw new Error('siteUrl is missing');

    return new Promise(function(resolve, reject) {
        var url = ENDPOINT.url.replace('{{siteUrl}}', encodeURIComponent(siteUrl));
        var queryParams = {
            'category': category,
            'platform': platform
        };
        var query = QueryFactory.createAuthorizedQuery(ENDPOINT.method, url, queryParams, {}, accessToken);
        query.runAsync()
        .spread(function(response, body) {
            resolve(ResponseUtil.parseResponse(response, body));
        })
        .catch(function(err) {
            console.log(err.error);
            reject(err);
        });
    });

};

module.exports = list;
