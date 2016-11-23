'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Useraccount = mongoose.model('Useraccount');

/**
 * Globals
 */
var user,
  useraccount;

/**
 * Unit tests
 */
describe('Useraccount Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      useraccount = new Useraccount({
        name: 'Useraccount Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return useraccount.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      useraccount.name = '';

      return useraccount.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Useraccount.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
