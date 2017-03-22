'use strict';

var Data        = require('./data'),
	Management  = require('./management');

function Analytics(ctx) {
	this.data = new Data(ctx);
	this.management = new Management(ctx);
//	this._services = [ this.data, this.management ];
}

// Analytics.prototype.setCredentials = function(credentials) {
// 	this._services.map(function(service) {
// 		service.setCredentials(credentials);
// 	})
// };

module.exports = Analytics;
