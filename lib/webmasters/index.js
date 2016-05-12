'use strict';

var webmasters = {
    searchAnalytics         : require('./searchAnalytics'),
    sites                   : require('./sites'),
    urlCrawlErrorsCounts    : require('./urlCrawlErrorsCounts'),
    urlCrawlErrorsSamples   : require('./urlCrawlErrorsSamples')
};

module.exports = webmasters;
