'use strict';

var oauth2;

oauth2 = {
    tokenInfo       : require('./tokenInfo'),
    token           : require('./token'),
    // Convenience Methods
    isTokenValid    : require('./isTokenValid'),
    refreshToken    : require('./refreshToken')
};

module.exports = oauth2;
