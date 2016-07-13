'use strict';

var GoogleApiClient = require('../../../lib/index'),
    config          = require('config'),
    queryParams     = {
        'start-date'    : '2016-05-01',
        'end-date'      : '2016-05-07',
        'ids'           : 'ga:44760888',
        'dimensions'    : [ 'mcf:basicChannelGroupingPath','mcf:sourcePath','mcf:mediumPath','mcf:campaignPath','mcf:conversionDate','mcf:pathLengthInInteractionsHistogram','mcf:timeLagInDaysHistogram' ],
        'metrics'       : [ 'mcf:firstImpressionConversions','mcf:firstImpressionValue','mcf:impressionAssistedConversions','mcf:impressionAssistedValue','mcf:totalConversions','mcf:totalConversionValue' ],
        'filters'       : [ 'mcf:conversionType==Transaction' ]
    };

GoogleApiClient.oauth2.refreshToken(config.sites.tld.googleAuth.refreshToken, config.google.clientId, config.google.clientSecret)
    .then(function(accessToken) {
        GoogleApiClient.analytics.data.mcf(queryParams, accessToken, config.social.googleAuth.clientId).
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
