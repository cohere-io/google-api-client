'use strict';

var refreshToken = require('../../../lib/oauth2/refreshToken'),
    urlCrawlErrorsSamples = require('../../../lib/webmasters/urlCrawlErrorsSamples'),
    config = require('config');

refreshToken(config.sites.tld.googleAuth.refreshToken, config.google.clientId, config.google.clientSecret)
    .then(function(accessToken) {
        urlCrawlErrorsSamples.markAsFixed(config.sites.tld.websiteUrl,
            '',
            'notFound',
            'web',
            accessToken)
            .then(function(result) {
                console.log(result);
            });
    })
    .catch(function(error) {
        console.log(error);
    });
