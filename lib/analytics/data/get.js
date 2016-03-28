'use strict';

var QueryFactory    = require('../../queryFactory'),
    Constants       = require('../../constants'),
    ENDPOINT        = {
        method  : 'GET',
        url     : Constants.API_BASE_URL + '/analytics/v3/data/ga'
    },
    get;

get = function(queryParams, accessToken, clientId) {

    if (typeof accessToken === 'undefined') throw new Error('accessToken is missing');
    if (typeof clientId === 'undefined')    throw new Error('clientId is missing');

    var self = this,
        startIndex = (queryParams && queryParams['start-index']) || 1;

    return new Promise(function(resolve, reject) {
        //var jobQueryParams = queryParams;
        //jobQueryParams['start-index'] = ((page - 1) * MAX_RESULT_SET_SIZE) + 1;
        var googleAnalyticsQuery = new QueryFactory.createCredentialedQuery(ENDPOINT.method, ENDPOINT.url, queryParams, {}, accessToken, clientId);
        googleAnalyticsQuery.runAsync()
        .spread(function(response, json) {
//                console.log('Completed page ' + page);
            // var response = results[0],
            //     json = results[1];
            // rows[page - 1] = json.rows;
            resolve([response, json]);
        })
        .catch(function(error) {
            console.log(error);
            reject(error);
        });
    });
};

module.exports = get;
