'use strict';

var Accounts        = require('./accounts'),
	Products        = require('./products'),
	ProductStatuses = require('./productstatuses');

function Content(clientId, version) {
	this.accounts = new Accounts(clientId, version);
	this.products = new Products(clientId, version);
	this.productstatuses = new ProductStatuses(clientId, version);
//	this._services = [ this.accounts, this.products, this.productstatuses ];
}

// Content.prototype.setCredentials = function(credentials) {
// 	this._services.map(function(service) {
// 		service.setCredentials(credentials);
// 	})
// };
//
module.exports = Content;