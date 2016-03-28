** Please Note : ** Major refactor makes version 2.0.x incompatible with prior
versions. 2.0.x is now called statically. Please see the example below.

A simple example:

```
return new Promise(function(resolve, reject) {

    var accessToken = '[YOUR_ACCESS_TOKEN]',
        refreshToken = '[YOUR_REFRESH_TOKEN]',
        clientId = '[YOUR_CLIENT_ID]',
        clientSecret = '[YOUR_CLIENT_SECRET]';

    GoogleApiClient.oauth2.isTokenValid(accessToken)
    .then(function(bool) {
        if (bool) {
            return accessToken;
        } else {
            return GoogleApiClient.oauth2.refreshToken(refreshToken, clientId, clientSecret)
            .then(function(newAccessToken) {
                return newAccessToken;
            });
        }
    })
    .then(function(validAccessToken) {
        GoogleApiClient.analytics.management.accounts.list(validAccessToken, clientId)
        .then(function(body) {
            resolve(body);
        });
    });
};
```
