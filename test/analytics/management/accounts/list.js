'use strict';

var GoogleApiClient = require('../../../../'),
    config          = require('config');

GoogleApiClient.oauth2.refreshToken(config.sites.tld.googleAuth.refreshToken, config.google.clientId, config.google.clientSecret)
.then(function(accessToken) {
    GoogleApiClient.analytics.management.accounts.list(accessToken, config.google.clientId)
    .then(function(result) {
        console.log(result);
    })
    .catch(function(error) {
        console.log(error);
    });
})
.catch(function(error) {
    console.log(error);
});
