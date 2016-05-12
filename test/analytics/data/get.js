'use strict';

var GoogleApiClient = require('../../../lib'),
    config          = require('config'),
    queryParams     = {
        'start-date'    : '2016-02-01',
        'end-date'      : '2016-02-01',
        'ids'           : 'ga:44760888',
        'dimensions'    : [ 'ga:date' ],
        'metrics'       : [ 'ga:sessions' ]
    };

GoogleApiClient.oauth2.refreshToken(config.sites.tld.googleAuth.refreshToken, config.google.clientId, config.google.clientSecret)
.then(function(accessToken) {
    GoogleApiClient.analytics.data.get(queryParams, accessToken, config.social.googleAuth.clientId).
    then(function(json) {
        console.log(json);
    })
    .catch(function(error) {
        console.log(error);
    });
})
.catch(function(error) {
    console.log(error);
});
