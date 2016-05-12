'use strict';

var GoogleApiClient     = require('../../../'),
    config              = require('config'),
    queryParams         = {
        'start-date'    :'2016-01-01',
        'end-date'      : '2016-03-01',
        'ids'           : 'ga:44760888',
        'dimensions'    : [
            'ga:dateHour',
            'ga:deviceCategory',
            'ga:landingPagePath'
        ],
        'metrics'       : [
            'ga:sessions'
        ]
    };

GoogleApiClient.oauth2.refreshToken(config.sites.tld.googleAuth.refreshToken, config.google.clientId, config.google.clientSecret)
.then(function(accessToken) {
    GoogleApiClient.analytics.data.getAll(queryParams, accessToken, config.google.clientId)
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
