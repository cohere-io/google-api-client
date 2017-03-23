3/23/17 : 2.1.0 modifies, yet again, how the client is instantiated. See the example below.

A simple example:

```
const google          = require('google-api-client'),
      queryParams     = {
        'start-date'    : '2017-03-01',
        'end-date'      : '2017-03-31',
        'ids'           : 'ga:[TABLE_ID]',
        'dimensions'    : 'ga:date',
        'metrics'       : 'ga:sessions'
      };

return new Promise(function(resolve, reject) {

    var Client = new google.ApiClient([CLIENT_ID]);

    Client.oauth2.refreshToken([REFRESH_TOKEN], [CLIENT_SECRET])
    .then(function(accessToken) {
	    Client.setAccessToken(accessToken);
	    return Client.analytics.data.get(queryParams);
    })
    .then(function(result) {
	    console.log(result);
    })
    .catch(function(error) {
	    console.log(error);
    });
};
```
