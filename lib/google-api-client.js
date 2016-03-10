'use strict';

var Promise = require('bluebird');
var request = Promise.promisify(require('request'), { multiArgs: true });
var PromiseQueue = require('promiseq');

var MAX_CONCURRENT_QUERIES = 10;
var MAX_RESULT_SET_SIZE = 10000;

var BASE_API_URL = 'https://www.googleapis.com';

var QUERIES = {
    OAUTH2: {
        TOKEN_INFO:         { url: BASE_API_URL + '/oauth2/v3/tokeninfo'            },
        REFRESH_TOKEN:      { url: BASE_API_URL + '/oauth2/v4/token'                }
    },
    ANALYTICS: {
        ACCOUNT_SUMMARIES:  { list: BASE_API_URL + '/analytics/v3/management/accountSummaries'                      },
        ACCOUNTS:           { list: BASE_API_URL + '/analytics/v3/management/accounts'                              },
        //WEB_PROPERTIES:     { list: BASE_API_URL + '/analytics/v3/management/accounts/{{accountId}}/webproperties'  },
        DATA:               { url : BASE_API_URL + '/analytics/v3/data/ga'                                          }

    }
};

function GoogleApiClient() {
}

GoogleApiClient.prototype.isTokenValid = function(accessToken) {

    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');

    var self = this;

    return new Promise(function(resolve, reject) {

        var queryParams = {
            'access_token': accessToken
        };

        var googleQuery = new GoogleQuery(QUERIES.OAUTH2.TOKEN_INFO.url, queryParams);

        googleQuery.runAsync()
        .then(function(result) {
            var response = result[0];
            resolve(response.statusCode === 200 ? true : false);
        })
        .catch(function(error) {
            console.log(error);
            reject(error);
        });
    });
};

GoogleApiClient.prototype.refreshToken = function(refreshToken, clientId, clientSecret) {

    if (typeof refreshToken === 'undefined') throw new Error('refreshToken is missing');
    if (typeof clientId === 'undefined')    throw new Error('clientId is missing');
    if (typeof clientSecret === 'undefined')    throw new Error('clientSecret is missing');

    var self = this;

    return new Promise(function(resolve, reject) {

        var queryParams = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret
        };

        var headers = {
            'Content-Type':'application/x-www-form-urlencoded'
        };

        var googleQuery = new GoogleQuery(QUERIES.OAUTH2.REFRESH_TOKEN.url, queryParams, headers);

        googleQuery.runAsync({ method: 'POST' })
        .then(function(result) {
            var response = result[0];
            var body = result[1];
            if (response.statusCode === 200) {
                resolve(body.access_token);
            } else {
                throw new Error('Could not refresh access_token');
            }
        })
        .catch(function(error) {
            console.log(error);
            reject(error);
        });
    });
};

// ANALYTICS DATA QUERIES ======================
//

GoogleApiClient.prototype.queryAnalyticsDataAsync = function(queryParams, accessToken, clientId) {

    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');
    if (typeof clientId === 'undefined')    throw new Error('clientId is missing');

    var self = this;

    return new Promise(function(resolve, reject) {

        var firstPageQuery = new GoogleCredentialedQuery(QUERIES.ANALYTICS.DATA.url, queryParams, accessToken, clientId);

        var queue = new PromiseQueue(MAX_CONCURRENT_QUERIES);

        firstPageQuery.runAsync()
        .then(function(results) {

            var response = results[0],
                body = results[1];

            if (response.statusCode !== 200) {
                reject(body && body.error && body.error.message);
            } else {

                self.responseData = {
                    kind                : body.kind,
                    id                  : body.id,
                    query               : body.query,
                    itemsPerPage: body.itemsPerPage,
                    totalResults: body.totalResults,
                    selfLink: body.selfLink,
                    profileInfo: body.profileInfo,
                    containsSampledData: body.containsSampledData,
                    columnHeaders: body.columnHeaders,
                    totalsForAllResults: body.totalsForAllResults
                };

                var totalPages = Math.floor(body.totalResults / MAX_RESULT_SET_SIZE) + (body.totalResults % MAX_RESULT_SET_SIZE > 0 ? 1 : 0);

                // Create an array to hold the results of parallel query jobs
                self.rows = new Array(totalPages);
                self.rows[0] = body.rows;

                // Now, create all the independent jobs necessary to retrieve the pages of results
                for (var page = 2; page <= totalPages; page++) {
                    var job = self.createAnalyticsQueryJob(queryParams, accessToken, clientId, page, self.rows);
                    queue.push(job);
                }

                return queue.close()

                .then(function() {
                    console.log('Queue closed and drained.');
                });
            }
        })
        .then(function(results) {
            // flatten it
            var flattened = [];
            for (var i in self.rows) {
                for (var j in self.rows[i]) {
                    flattened.push(self.rows[i][j]);
                }
            }
            self.responseData.rows = flattened;
            resolve(self.responseData);
        })
        .catch(function(error) {
            console.log(error);
            reject(error);
        });
    });
};

GoogleApiClient.prototype.createAnalyticsQueryJob = function(queryParams, accessToken, clientId, page, rows) {

    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');
    if (typeof clientId === 'undefined')    throw new Error('clientId is missing');

    var self = this;

    return function() {
        return new Promise(function(resolve, reject) {
            var jobQueryParams = queryParams;
            jobQueryParams['start-index'] = ((page - 1) * MAX_RESULT_SET_SIZE) + 1;
            var googleAnalyticsQuery = new GoogleCredentialedQuery(QUERIES.ANALYTICS.DATA.url, jobQueryParams, accessToken, clientId);
            googleAnalyticsQuery.runAsync()
            .then(function(results) {
                console.log('Completed page ' + page);
                var response = results[0],
                    json = results[1];
                rows[page - 1] = json.rows;
                resolve(page);
            })
            .catch(function(error) {
                console.log(error);
                reject(error);
            });
        });
    };
};

// ANALYTICS MANAGEMENT QUERIES
//

GoogleApiClient.prototype.accountSummaries = function(accessToken, clientId) {

    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');
    if (typeof clientId === 'undefined')    throw new Error('clientId is missing');

    var self = this;
    return new Promise(function(resolve, reject) {
        var query = new GoogleCredentialedQuery(QUERIES.ANALYTICS.ACCOUNT_SUMMARIES.list, {}, accessToken, clientId);
        query.runAsync()
        .then(function(result) {
            var response = result[0];
            var body = result[1];
            resolve(body);
        });
    });
};

GoogleApiClient.prototype.accounts = function(accessToken, clientId) {

    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');
    if (typeof clientId === 'undefined')    throw new Error('clientId is missing');

    var self = this;
    return new Promise(function(resolve, reject) {
        var query = new GoogleCredentialedQuery(QUERIES.ANALYTICS.ACCOUNTS.list, {}, accessToken, clientId);
        query.runAsync()
        .then(function(result) {
            var response = result[0];
            var body = result[1];
            resolve(body);
        });
    });
};

//
// GoogleQuery

function GoogleQuery(url, queryParams, headers) {
    this.url = url;
    this.queryParams = queryParams || {};
    this.headers = headers || {};
}

GoogleQuery.prototype.runAsync = function(options) {

    var self = this;

    return new Promise(function(resolve, reject) {


        var params = [];
        var method = (options && options.method) || 'GET';
        for (var property in self.queryParams) {
            params.push(encodeURIComponent(property) + '=' + encodeURIComponent(self.queryParams[property]));
        }
        var url = self.url;
        if (params.length > 0) {
            url += '?' + params.join('&');
        }
        request({
            headers: self.headers,
            method: method,
            uri: url
        })
        .spread(function(response, body) {
            if (response.statusCode === 200) {
                return [response.toJSON(), JSON.parse(body)];
            } else {
                return([response.toJSON(),JSON.parse(body)]);
            }
        })
        .then(function(result) {
            resolve(result);
        })
        .catch(function(error) {
            reject(error);
        });
    });
};

function GoogleAuthorizedQuery(url, queryParams, accessToken) {
    var headers = { 'Authorization' : 'Bearer ' + accessToken };
    return GoogleQuery.call(this, url, queryParams, headers);
}

GoogleAuthorizedQuery.prototype.runAsync = function(options) {
    return GoogleQuery.prototype.runAsync.call(this, options);
};

function GoogleCredentialedQuery(url, queryParams, accessToken, clientId) {
    var headers = { 'Authorization' : 'Bearer ' + accessToken };
    queryParams.client_id = clientId;
    return GoogleQuery.call(this, url, queryParams, headers);
}

GoogleCredentialedQuery.prototype.runAsync = function(options) {
    return GoogleQuery.prototype.runAsync.call(this, options);
};


module.exports = GoogleApiClient;
