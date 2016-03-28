'use strict';

var Promise         = require('bluebird'),
    Constants       = require('../../constants'),
    QueryFactory    = require('../../queryFactory'),
    ResponseUtil    = require('../../utils/responseUtil'),
    ENDPOINT = {
        method  : 'GET',
        url     : Constants.API_BASE_URL + '/webmasters/v3/sites/{{siteUrl}}'
    },

    get;

get = function(siteUrl, accessToken) {

    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');
    if (typeof siteUrl === 'undefined') throw new Error('siteUrl is missing');

    var self = this;

    return new Promise(function(resolve, reject) {
        var url = ENDPOINT.url.replace('{{siteUrl}}', encodeURIComponent(siteUrl));
        var query = QueryFactory.createAuthorizedQuery(ENDPOINT.method, url, {}, {}, accessToken);
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

module.exports = get;
