var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , MyUSAStrategy = require('passport-myusa').Strategy;

var MYUSA_CLIENT_ID = process.env.MYUSA_CLIENT_ID || "--insert-myusa-client-id-here--"
var MYUSA_CLIENT_SECRET = process.env.MYUSA_CLIENT_SECRET || "--insert-myusa-client-secret-here--";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete MyUSA profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the MyUSAStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and MyUSA
//   profile), and invoke a callback with a user object.
passport.use(new MyUSAStrategy({
    clientID: MYUSA_CLIENT_ID,
    clientSecret: MYUSA_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/myusa/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's MyUSA profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the MyUSA account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));



var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/myusa
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in MyUSA authentication will involve
//   redirecting the user to my.usa.gov.  After authorization, MyUSA
//   will redirect the user back to this application at /auth/myusa/callback
//   or whatever you specified when you registered your myusa application
app.get('/auth/myusa',
  passport.authenticate('myusa', {scope: 'profile'}),
  function(req, res){
    // The request will be redirected to MyUSA for authentication, so this
    // function will not be called.
  });

// GET /auth/myusa/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/myusa/callback', 
  passport.authenticate('myusa', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}