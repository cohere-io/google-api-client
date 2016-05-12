'use strict';

var errorConstants = {
    CATEGORIES : {
        AUTH_PERMISSIONS        : 'authPermissions',
        FLASH_CONTENT           : 'flashContent',
        MANY_TO_ONE_REDIRECT    : 'manyToOneRedirect',
        NOT_FOLLOWED            : 'notFollowed',
        NOT_FOUND               : 'notFound',
        OTHER                   : 'other',
        ROBOTED                 : 'roboted',
        SERVER_ERROR            : 'serverError',
        SOFT_404                : 'soft404'
    },
    PLATFORMS : {
        MOBILE          : 'mobile',
        SMARTPHONE_ONLY : 'smartphoneOnly',
        WEB             : 'web'
    }
};

module.exports = errorConstants;
