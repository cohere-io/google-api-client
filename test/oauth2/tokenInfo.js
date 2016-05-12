'use strict';

var tokenInfo = require('../../lib/oauth2/tokenInfo'),
    config = require('config');

tokenInfo(config.sites.tld.googleAuth.accessToken)
.spread(function(response, body) {
    console.log('-- RESPONSE:');
    console.log(response);
    console.log('-- BODY:');
    console.log(body);
});
