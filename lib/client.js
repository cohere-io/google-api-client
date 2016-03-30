'use strict';

var GoogleApiClient;

GoogleApiClient = {
    analytics   : require('./analytics'),
    oauth2      : require('./oauth2'),
    webmasters  : require('./webmasters'),
    scopes      : require('./scopes')
};

module.exports = GoogleApiClient;
