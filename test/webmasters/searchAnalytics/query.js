'use strict';

var refreshToken = require('../../../lib/oauth2/refreshToken'),
    query = require('../../../lib/webmasters/searchAnalytics/query'),
    config = require('config');

var queryParams = {
    startDate: '2016-02-01',
    endDate: '2016-02-01',
    dimensions: ['date','query', 'page', 'device', 'country'],    
    rowLimit: 5000
};

refreshToken(config.sites.tld.googleAuth.refreshToken, config.google.clientId, config.google.clientSecret)
.then(function(accessToken) {
    query(config.sites.tld.websiteUrl, queryParams, accessToken, config.google.clientId)
    .spread(function(response, body) {
        console.log(body);
    });
})
.catch(function(error) {
    console.log(error);
});
