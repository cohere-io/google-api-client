'use strict';

var refreshToken = require('../../../lib/oauth2/refreshToken'),
    query = require('../../../lib/webmasters/searchAnalytics/query'),
    config = require('config');

var queryParams = {
    startDate: '2016-06-01',
    endDate: '2016-06-01',
    dimensions: ['date','query', 'page', 'device', 'country'],    
    rowLimit: 5000
};

refreshToken(config.sites.glorycycles.googleAuth.refreshToken, config.google.clientId, config.google.clientSecret)
.then(function(accessToken) {
    query(config.sites.glorycycles.websiteUrl, queryParams, accessToken, config.google.clientId)
    .spread(function(response, body) {
        Object.keys(body.rows).forEach(function(key) {
            console.log(body.rows[key]);
        });
    });
})
.catch(function(error) {
    console.log(error);
});
