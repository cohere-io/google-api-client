'use strict';

var Promise         = require('bluebird'),
    Constants       = require('../../constants'),
    QueryFactory    = require('../../queryFactory'),
    ResponseUtil    = require('../../utils/responseUtil'),
    ENDPOINT = {
        method  : 'DELETE',
        url     : Constants.API_BASE_URL + '/webmasters/v3/sites/{{siteUrl}}/urlCrawlErrorsSamples/{{url}}'
    },

    markAsFixed;

markAsFixed = function(siteUrl, url, category, platform, accessToken) {

    if (typeof siteUrl === 'undefined')     throw new Error('siteUrl is missing');
    if (typeof url === 'undefined')         throw new Error('url is missing');
    if (typeof category === 'undefined')    throw new Error('url is missing');
    if (typeof platform === 'undefined')    throw new Error('url is missing');
    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');

    return new Promise(function(resolve, reject) {
        var url = ENDPOINT.url.replace('{{siteUrl}}', encodeURIComponent(siteUrl));
        url = url.replace('{{url}}', encodeURIComponent(url));
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

module.exports = markAsFixed;
