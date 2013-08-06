var vows = require('vows');
var assert = require('assert');
var util = require('util');
var myusa = require('passport-myusa');

vows.describe('passport-myusa').addBatch({

  'module': {
    'should report a version': function (x) {
      assert.isString(myusa.version);
    }
  }
  
}).export(module);