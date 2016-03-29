'use strict';

var Promise         = require('bluebird'),
    token = require('./token'),
    refreshToken;

refreshToken = function(refreshToken, clientId, clientSecret) {
    return new Promise(function(resolve, reject) {
        token(refreshToken, clientId, clientSecret)
        .spread(function(response, body) {
            if (response.statusCode === 200) {
                resolve(body.access_token);
            } else {
                throw new Error('Could not refresh access_token');
            }
        })
        .catch(function(error) {
            reject(error);
        });
    });
};

module.exports = refreshToken;
