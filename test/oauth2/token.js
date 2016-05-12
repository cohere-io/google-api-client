'use strict';

var token = require('../../lib/oauth2/token');
var config = require('config');

token(config.sites.tld.googleAuth.refreshToken, config.google.clientId, config.google.clientSecret)
.then(function(response, body) {
    console.log('------ RESPONSE:');
    console.log(response);
    console.log('------ BODY:');
    console.log(body);
})
.catch(function(error) {
    console.log(error);
});
