'use strict';

var Accounts            = require('./accounts'),
    AccountSummaries    = require('./accountSummaries');

function Management(ctx) {
    this.accounts           = new Accounts(ctx);
    this.accountSummaries   = new AccountSummaries(ctx);
    //this._services = [ this.accounts, this.accountSummaries ];
}

module.exports = Management;
