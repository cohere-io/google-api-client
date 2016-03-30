'use strict';

var _parseResponse = function(response, body) {

    // handle response
    if (response.hasOwnProperty('toJSON')) {
        response = response.toJSON();
    } else if (typeof response === 'string' &&
        /^[\],:{}\s]*$/.test(response.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            // http://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
            // Test for JSON string
            body = JSON.parse(response);
    }

    // handle body
    if (typeof body === 'string' &&
        /^[\],:{}\s]*$/.test(body.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            // http://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
            // Test for JSON string
            body = JSON.parse(body);
    }

    return [response, body];
};

module.exports = {
    parseResponse : _parseResponse
};
