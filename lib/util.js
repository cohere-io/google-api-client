var Promise = require('bluebird');

var promiseWhile = Promise.method(function(condition, action) {
	if (!condition()) return;
	return action().then(promiseWhile.bind(null, condition, action));
});

module.exports = {
	promiseWhile : promiseWhile
};
