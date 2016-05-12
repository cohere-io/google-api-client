'use strict';

var refreshToken = require('../../../lib/oauth2/refreshToken'),
    sites = require('../../../lib/webmasters/sites'),
    config = require('config');


refreshToken(config.sites.tld.googleAuth.refreshToken, config.google.clientId, config.google.clientSecret)
.then(function(accessToken) {
    sites.get(config.sites.tld.websiteUrl, accessToken)
    .then(function(result) {
        console.log(result);
    });
})
.catch(function(error) {
    console.log(error);
});
