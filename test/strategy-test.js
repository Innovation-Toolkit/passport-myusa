var vows = require('vows');
var assert = require('assert');
var util = require('util');
var MyUSAStrategy = require('passport-myusa/strategy');

vows.describe('MyUSAStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new MyUSAStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named myusa': function (strategy) {
      assert.equal(strategy.name, 'myusa');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new MyUSAStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        var body = '{"title":null,"first_name":"Joe","middle_name":null,"last_name":"Polastre","suffix":null,"address":null,"address2":null,"city":null,"state":null,"zip":null,"phone_number":null,"mobile_number":null,"gender":null,"marital_status":null,"is_parent":null,"is_retired":null,"is_veteran":null,"is_student":null,"email":"joe@polastre.com","id":"a44d2d36-f7de-47be-b557-a81367cb5048"}';
        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'myusa');
        assert.equal(profile.id, 'a44d2d36-f7de-47be-b557-a81367cb5048');
        assert.equal(profile.displayName, 'Joe Polastre');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new MyUSAStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        callback(new Error('something-went-wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },
  
}).export(module);