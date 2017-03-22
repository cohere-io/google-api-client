'use strict';

require('./inheritance');

var QueryFactory = require('./factory'),
	OAuth2      = require('./oauth2'),
	Content     = require('./content'),
	Analytics   = require('./analytics'),
	Webmasters  = require('./webmasters');

var ApiClient = function(clientId) {

	this._clientId = clientId;
	this._builder = new QueryFactory.Builder(this._clientId);

	this.oauth2 = new OAuth2(this._builder);
	this.analytics = new Analytics(this._builder);
	this.content = new Content(this._builder);
	this.webmasters = new Webmasters(this._builder);

	this.setAccessToken = function(accessToken) {
		this._builder.setAccessToken(accessToken);
	};
	// this.getBuilder = function() {
	// 	return this._builder;
	// };
	this.getClientId = function() {
		return this._clientId;
	};

};

var scopes = require('./scopes');

module.exports = {
	ApiClient   : ApiClient,
	scopes      : scopes
};

// GoogleApiClient.prototype.setCredentials = function(credentials) {
// 	this._services.map(function(service) {
// 		service.setCredentials(credentials);
// 	})
// };

// GoogleApiClient = {
// 	analytics       : require('./analytics'),
// 	oauth2          : require('./oauth2'),
// 	webmasters      : require('./webmasters'),
// 	content : require('./content'),
// 	scopes          : require('./scopes')
// };

