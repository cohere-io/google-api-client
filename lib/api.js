'use strict';

require('./inheritance');

var QueryFactory = require('./factory');

function Api(clientId, version) {
	if (clientId) {
		this.client = new QueryFactory.Client(credentials);
		this.version = version || 'v3';
	}
}

// Api.method('setCredentials', function(clientId, version) {
// 	credentials || (credentials = {});
// 	if (credentials.clientId) {
// 		this.client = new QueryFactory.Client(credentials);
// 		this.version = version || 'v2';
// 	}
// 	return this;
// });

Api.method('getClient', function() {
	return this.client;
});

module.exports = Api;
