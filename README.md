-- TODO

A simple example:

```
var GoogleApiClient = require('google-api-client');

return new Promise(function(resolve, reject) {

    var client = new GoogleApiClient();
    var accessToken = '[YOUR_ACCESS_TOKEN]';
    var refreshToken = '[YOUR_REFRESH_TOKEN]';
    var clientId = '[YOUR_CLIENT_ID]';
    var clientSecret = '[YOUR_CLIENT_SECRET]';

    client.isTokenValid(accessToken)
    .then(function(bool) {
        if (bool) {
            return accessToken;
        } else {
            return client.refreshToken(refreshToken, clientId, clientSecret)
            .then(function(newAccessToken) {
                return newAccessToken;
            });
        }
    })
    .then(function(validAccessToken) {
        client.accounts(validAccessToken, clientId).then(function(body) {
            resolve(body);
        });
    });
};
```
