'use strict';

var Promise         = require('bluebird'),
    request         = Promise.promisify(require('request'), { multiArgs: true }),
    queryFactory;

function Query(method, url, queryParams, headers) {
    this.method = method;
    this.url = url;
    this.queryParams = queryParams || {};
    this.headers = headers || {};
};

var AuthorizedQuery = function(method, url, queryParams, headers, accessToken) {
    queryParams = queryParams || {};
    headers = headers || {};
    headers.Authorization = 'Bearer ' + accessToken;
    return Query.call(this, method, url, queryParams, headers);
};

AuthorizedQuery.prototype.runAsync = function(options) {
    return Query.prototype.runAsync.call(this, options);
};

var CredentialedQuery = function(method, url, queryParams, headers, accessToken, clientId) {
    queryParams = queryParams || {};
    headers = headers || {};
    queryParams.client_id = clientId;
    headers.Authorization = 'Bearer ' + accessToken;
    return Query.call(this, method, url, queryParams, headers);
};

CredentialedQuery.prototype.runAsync = function(options) {
    return Query.prototype.runAsync.call(this, options);
};

Query.prototype.runAsync = function(options) {
    var self = this;

    return new Promise(function(resolve, reject) {
        var url = self.url;
        var requestParameters = {
            method: self.method
        };
        if (self.headers && Object.keys(self.headers).length > 0) {
            requestParameters.headers = self.headers;
        }
        if (options && options.postJson) {
            // POST request
            requestParameters.headers = requestParameters.headers || {};
            requestParameters.json = self.queryParams;
        } else {
            var params = [];
            for (var property in self.queryParams) {
                params.push(encodeURIComponent(property) + '=' + encodeURIComponent(self.queryParams[property]));
            }
            if (params.length > 0) {
                url += '?' + params.join('&');
            }
        }
        requestParameters.uri = url;

        console.log(url);

        request(requestParameters)
        .spread(function(response, body) {
            return([response,body]);
        })
        .then(function(result) {
            resolve(result);
        })
        .catch(function(error) {
            reject(error);
        });
    });
};

queryFactory = {
    createQuery: function(method, url, queryParams, headers) {
        return new Query(method, url, queryParams, headers);
    },
    createAuthorizedQuery: function(method, url, queryParams, headers, accessToken) {
        return new AuthorizedQuery(method, url, queryParams, headers, accessToken);
    },
    createCredentialedQuery: function(method, url, queryParams, headers, accessToken, clientId) {
        return new CredentialedQuery(method, url, queryParams, headers, accessToken, clientId);
    }
};

module.exports = queryFactory;
