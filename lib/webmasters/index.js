'use strict';

var SearchAnalytics = require('./searchAnalytics'),
	Sites           = require('./sites');

function Webmasters(ctx) {
	this.searchAnalytics    = new SearchAnalytics(ctx);
    this.sites              = new Sites(ctx);
}

module.exports = Webmasters;

// var webmasters = {
//     searchAnalytics         : require('./searchAnalytics'),
//     sites                   : require('./sites'),
//     urlCrawlErrorsCounts    : require('./urlCrawlErrorsCounts'),
//     urlCrawlErrorsSamples   : require('./urlCrawlErrorsSamples'),
//     CRAWL_CATEGORIES        : {
//         AUTH_PERMISSIONS        : 'authPermissions',
//         FLASH_CONTENT           : 'flashContent',
//         MANY_TO_ONE_REDIRECT    : 'manyToOneRedirect',
//         NOT_FOLLOWED            : 'notFollowed',
//         NOT_FOUND               : 'notFound',
//         OTHER                   : 'other',
//         ROBOTED                 : 'roboted',
//         SERVER_ERROR            : 'serverError',
//         SOFT_404                : 'soft404'
//     },
//     CRAWL_PLATFORMS         : {
//         MOBILE                  : 'mobile',
//         SMARTPHONE_ONLY         : 'smartphoneOnly',
//         WEB                     : 'web'
//     }
// };

module.exports = Webmasters;
