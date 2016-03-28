'use strict';

var QueryFactory            = require('../../queryFactory'),
    get                     = require('./get'),
    PromiseQueue            = require('promiseq'),
    _                       = require('lodash'),
    MAX_CONCURRENT_QUERIES  = 10,
    MAX_RESULT_SET_SIZE     = 10000,
    getAll,
    _queryJob;

getAll = function(queryParams, accessToken, clientId) {

    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');
    if (typeof clientId === 'undefined')    throw new Error('clientId is missing');

    var scope = {};

    return new Promise(function(resolve, reject) {

        var queue = new PromiseQueue(MAX_CONCURRENT_QUERIES);

        queryParams = _.merge({ 'max-results' : MAX_RESULT_SET_SIZE }, queryParams );

        console.log('running first query');

        get(queryParams, accessToken, clientId)
        .then(function(result) {
            console.log('page 1 complete');
            var response    = result[0],
                body        = result[1],
                json        = JSON.parse(body);

            if (response.statusCode !== 200) {
                resolve(json);
            } else if (json.totalResults === 0) {
                resolve(json);
            }

            scope.responseData = {
                kind                : json.kind,
                id                  : json.id,
                query               : json.query,
                itemsPerPage        : json.itemsPerPage,
                totalResults        : json.totalResults,
                selfLink            : json.selfLink,
                profileInfo         : json.profileInfo,
                containsSampledData : json.containsSampledData,
                columnHeaders       : json.columnHeaders,
                totalsForAllResults : json.totalsForAllResults
            };

            var totalPages = Math.floor(json.totalResults / MAX_RESULT_SET_SIZE) + (json.totalResults % MAX_RESULT_SET_SIZE > 0 ? 1 : 0);

            // Create an array to hold the results of parallel query jobs
            scope.rows = new Array(totalPages);
            scope.rows[0] = json.rows;

            // Now, create all the independent jobs necessary to retrieve the pages of results
            for (var page = 2; page <= totalPages; page++) {
                var job = _queryJob(queryParams, accessToken, clientId, page, scope.rows);
                queue.push(job);
            }

            return queue.close()
            .then(function() {
                console.log('queue closed and drained.');
            });
        })
        .then(function(result) {
            var flattened = [];
            for (var i in scope.rows) {
                for (var j in scope.rows[i]) {
                    flattened.push(scope.rows[i][j]);
                }
            }
            scope.responseData.rows = flattened;
            resolve(scope.responseData);
        })
        .catch(function(error) {
            console.log(error);
            reject(error);
        });
    });
};


_queryJob = function(queryParams, accessToken, clientId, page, rows) {
    return function() {
        return new Promise(function(resolve, reject) {
            var params = _.merge(
                {
                    'start-index'   : ((page - 1) * MAX_RESULT_SET_SIZE) + 1,
                    'max-results'   : MAX_RESULT_SET_SIZE
                },
                queryParams
            );
            console.log('running page ' + page);
            get(params, accessToken, clientId)
            .then(function(result) {
                var body = result[1];
                var json = JSON.parse(body);
                rows[page] = json.rows;
                console.log('page ' + page + ' complete');
                resolve();
            })
            .catch(function(error) {
                reject(error);
            });
        });
    };

};

module.exports = getAll;
