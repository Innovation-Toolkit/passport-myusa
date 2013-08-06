passport-myusa
==============

[Passport](https://github.com/jaredhanson/passport) Authentication Strategy for 
MyUSA (my.usa.gov) using the OAuth 2.0 API.

This module lets you authenticate using MyUSA in your Node.js applications.
By plugging into Passport, MyUSA authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/) and [Sails](http://www.sailsjs.org).

## Install

    $ npm install passport-myusa

#### Development Install

    $ git clone git://github.com:Innovation-Toolkit/passport-myusa.git
    $ cd passport-myusa
    $ sudo npm link
    change to your project's directory
    $ npm link passport-myusa

## Usage

#### Configure Strategy

The MyUSA authentication strategy authenticates users using an MyUSA
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

Note that the `callbackURL` must match **exactly** the callback registered
for your application at [MyUSA](https://my.usa.gov/apps).

    passport.use(new MyUSAStrategy({
        clientID: MYUSA_CLIENT_ID,
        clientSecret: MYUSA_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/myusa/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ myusaId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

The fields available in the profile are defined by [Passport's Standard Profile](http://passportjs.org/guide/profile/).  Two extra fields are included in the profile: `_raw` and `_json`.  `_raw` is the raw response from the MyUSA server, whereas `_json` is the JSON-parsed representation of the raw response.

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'myusa'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/myusa',
      passport.authenticate('myusa'));

    app.get('/auth/myusa/callback', 
      passport.authenticate('myusa', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/Innovation-Toolkit/passport-myusa/tree/master/examples/login).

## Tests

[![Build Status](https://travis-ci.org/Innovation-Toolkit/passport-myusa.png?branch=master)](https://travis-ci.org/Innovation-Toolkit/passport-myusa) [![Dependency Status](https://gemnasium.com/Innovation-Toolkit/passport-myusa.png)](https://gemnasium.com/Innovation-Toolkit/passport-myusa)

    $ npm install --dev
    $ make test

## Notes on MyUSA Authentication

Register your application with [MyUSA](https://my.usa.gov/apps) and save your Client ID and Secret.  Select the scopes that your application requires.

The user authentication URL and token exchange URL for MyUSA are `https://my.usa.gov/oauth/authenticate`

The REST API for profile information is `https://my.usa.gov/api/profile`

All API calls, including GET requests, must include the `Authorization: OAuth <token>` HTTP header.  Be sure to use `OAuth` as the authentication type since MyUSA does not support `Bearer` authentication.  Also, MyUSA does **not** support GET requests with the authorization token specified using a query string (eg: `GET https://my.usa.gov/api/endpoint?bearer_token=foo` is not supported).

An example using [node-oauth](https://github.com/ciaranj/node-oauth):

    var OAuth2 = require('oauth').OAuth2;
    var oauth = new OAuth2(CLIENT_ID, CLIENT_SECRET, '',
        AUTHORIZATION_URL, TOKEN_URL, null);
    // Reset the Auth Method to 'OAuth' for MyUSA
    oauth.setAuthMethod('OAuth');
    // Use authorization headers for GET, not query string
    oauth.useAuthorizationHeaderforGET(true);
    // Make request
    oauth2.get(PROFILE_URL, ACCESS_TOKEN, function (err, body, res) {
        // parse profile
    });

## Credits

  - [Joe Polastre](http://github.com/polastre)

## License

You may use this project under [The MIT License](http://opensource.org/licenses/MIT).
