'use strict';

var Promise         = require('bluebird'),
    tokenInfo       = require('./tokenInfo'),
    isTokenValid;

isTokenValid = function(accessToken) {
    return new Promise(function(resolve, reject) {
        tokenInfo(accessToken)
        .spread(function(response, body) {
            resolve(response.statusCode === 200);
        })
        .catch(function(error) {
            reject(error);
        });
    });
};

module.exports = isTokenValid;
