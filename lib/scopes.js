'use strict';

var Constants = require('./constants'),
    scopes;

scopes = {
    ANALYTICS: {
        readonly    : Constants.API_BASE_URL + '/auth/analytics.readonly',
        edit        : Constants.API_BASE_URL + '/auth/analytics'
    },
    ANALYTICS_MANAGEMENT: {
        readonly    : Constants.API_BASE_URL + '/auth/management.readonly',
        edit        : Constants.API_BASE_URL + '/auth/management'
    },
    WEBMASTER_TOOLS: {
        readonly    : Constants.API_BASE_URL + '/auth/webmasters.readonly',
        edit        : Constants.API_BASE_URL + '/auth/webmasters'
    }
};

module.exports = scopes;
