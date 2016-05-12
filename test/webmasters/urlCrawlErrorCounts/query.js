'use strict';

var refreshToken = require('../../../lib/oauth2/refreshToken'),
    urlCrawlErrorsCounts = require('../../../lib/webmasters/urlCrawlErrorsCounts'),
    config = require('config');

refreshToken(config.sites.tld.googleAuth.refreshToken, config.google.clientId, config.google.clientSecret)
.then(function(accessToken) {
    var queryParams = { latestCountsOnly: 'false' };
    urlCrawlErrorsCounts.query(config.sites.tld.websiteUrl, accessToken, queryParams)
    .then(function(result) {
        console.log(result);
    });
})
.catch(function(error) {
    console.log(error);
});
