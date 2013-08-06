/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The MyUSA authentication strategy authenticates requests by delegating to
 * MyUSA.gov using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your MyUSA application's client id
 *   - `clientSecret`  your MyUSA application's client secret
 *   - `callbackURL`   redirect URL registered with MyUSA
 *
 * Additional Options:
 *   - `authorizationURL`    URL to redirect clients for authentication
 *   - `tokenURL`      Endpoint to exchange authorization code for token
 *   - `profileURL`    API endpoint for profiles
 *
 * Examples:
 *
 *     passport.use(new MyUSAStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         callbackURL: 'https://my.app.com/auth/myusa/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://my.usa.gov/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://my.usa.gov/oauth/authorize';
  options.callbackURL = options.callbackURL || 'http://localhost:3000/auth/myusa/callback';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'myusa';
  this._profileURL = options.profileURL || 'https://my.usa.gov/api/profile';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from MyUSA.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `myusa`
 *   - `id`
 *   - `displayName`
 *   - `name`
 *   - `emails`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  // MyUSA requires HTTP Header-based Authorization
  this._oauth2.useAuthorizationHeaderforGET(true);
  this._oauth2.get(this._profileURL, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      var profile = { provider: 'myusa' };
      profile.id = json.id;
      profile.emails = [{ value: json.email, type: 'work' }];
      profile.name = {
        familyName: json.last_name,
        givenName: json.first_name,
        middleName: json.middle_name
      }
      if (json.last_name && json.first_name) {
        profile.displayName = json.first_name + ' ' + json.last_name; 
      }
      
      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;