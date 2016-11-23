'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Useraccount = mongoose.model('Useraccount'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  useraccount;

/**
 * Useraccount routes tests
 */
describe('Useraccount CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Useraccount
    user.save(function () {
      useraccount = {
        name: 'Useraccount name'
      };

      done();
    });
  });

  it('should be able to save a Useraccount if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Useraccount
        agent.post('/api/useraccounts')
          .send(useraccount)
          .expect(200)
          .end(function (useraccountSaveErr, useraccountSaveRes) {
            // Handle Useraccount save error
            if (useraccountSaveErr) {
              return done(useraccountSaveErr);
            }

            // Get a list of Useraccounts
            agent.get('/api/useraccounts')
              .end(function (useraccountsGetErr, useraccountsGetRes) {
                // Handle Useraccounts save error
                if (useraccountsGetErr) {
                  return done(useraccountsGetErr);
                }

                // Get Useraccounts list
                var useraccounts = useraccountsGetRes.body;

                // Set assertions
                (useraccounts[0].user._id).should.equal(userId);
                (useraccounts[0].name).should.match('Useraccount name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Useraccount if not logged in', function (done) {
    agent.post('/api/useraccounts')
      .send(useraccount)
      .expect(403)
      .end(function (useraccountSaveErr, useraccountSaveRes) {
        // Call the assertion callback
        done(useraccountSaveErr);
      });
  });

  it('should not be able to save an Useraccount if no name is provided', function (done) {
    // Invalidate name field
    useraccount.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Useraccount
        agent.post('/api/useraccounts')
          .send(useraccount)
          .expect(400)
          .end(function (useraccountSaveErr, useraccountSaveRes) {
            // Set message assertion
            (useraccountSaveRes.body.message).should.match('Please fill Useraccount name');

            // Handle Useraccount save error
            done(useraccountSaveErr);
          });
      });
  });

  it('should be able to update an Useraccount if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Useraccount
        agent.post('/api/useraccounts')
          .send(useraccount)
          .expect(200)
          .end(function (useraccountSaveErr, useraccountSaveRes) {
            // Handle Useraccount save error
            if (useraccountSaveErr) {
              return done(useraccountSaveErr);
            }

            // Update Useraccount name
            useraccount.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Useraccount
            agent.put('/api/useraccounts/' + useraccountSaveRes.body._id)
              .send(useraccount)
              .expect(200)
              .end(function (useraccountUpdateErr, useraccountUpdateRes) {
                // Handle Useraccount update error
                if (useraccountUpdateErr) {
                  return done(useraccountUpdateErr);
                }

                // Set assertions
                (useraccountUpdateRes.body._id).should.equal(useraccountSaveRes.body._id);
                (useraccountUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Useraccounts if not signed in', function (done) {
    // Create new Useraccount model instance
    var useraccountObj = new Useraccount(useraccount);

    // Save the useraccount
    useraccountObj.save(function () {
      // Request Useraccounts
      request(app).get('/api/useraccounts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Useraccount if not signed in', function (done) {
    // Create new Useraccount model instance
    var useraccountObj = new Useraccount(useraccount);

    // Save the Useraccount
    useraccountObj.save(function () {
      request(app).get('/api/useraccounts/' + useraccountObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', useraccount.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Useraccount with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/useraccounts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Useraccount is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Useraccount which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Useraccount
    request(app).get('/api/useraccounts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Useraccount with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Useraccount if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Useraccount
        agent.post('/api/useraccounts')
          .send(useraccount)
          .expect(200)
          .end(function (useraccountSaveErr, useraccountSaveRes) {
            // Handle Useraccount save error
            if (useraccountSaveErr) {
              return done(useraccountSaveErr);
            }

            // Delete an existing Useraccount
            agent.delete('/api/useraccounts/' + useraccountSaveRes.body._id)
              .send(useraccount)
              .expect(200)
              .end(function (useraccountDeleteErr, useraccountDeleteRes) {
                // Handle useraccount error error
                if (useraccountDeleteErr) {
                  return done(useraccountDeleteErr);
                }

                // Set assertions
                (useraccountDeleteRes.body._id).should.equal(useraccountSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Useraccount if not signed in', function (done) {
    // Set Useraccount user
    useraccount.user = user;

    // Create new Useraccount model instance
    var useraccountObj = new Useraccount(useraccount);

    // Save the Useraccount
    useraccountObj.save(function () {
      // Try deleting Useraccount
      request(app).delete('/api/useraccounts/' + useraccountObj._id)
        .expect(403)
        .end(function (useraccountDeleteErr, useraccountDeleteRes) {
          // Set message assertion
          (useraccountDeleteRes.body.message).should.match('User is not authorized');

          // Handle Useraccount error error
          done(useraccountDeleteErr);
        });

    });
  });

  it('should be able to get a single Useraccount that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Useraccount
          agent.post('/api/useraccounts')
            .send(useraccount)
            .expect(200)
            .end(function (useraccountSaveErr, useraccountSaveRes) {
              // Handle Useraccount save error
              if (useraccountSaveErr) {
                return done(useraccountSaveErr);
              }

              // Set assertions on new Useraccount
              (useraccountSaveRes.body.name).should.equal(useraccount.name);
              should.exist(useraccountSaveRes.body.user);
              should.equal(useraccountSaveRes.body.user._id, orphanId);

              // force the Useraccount to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Useraccount
                    agent.get('/api/useraccounts/' + useraccountSaveRes.body._id)
                      .expect(200)
                      .end(function (useraccountInfoErr, useraccountInfoRes) {
                        // Handle Useraccount error
                        if (useraccountInfoErr) {
                          return done(useraccountInfoErr);
                        }

                        // Set assertions
                        (useraccountInfoRes.body._id).should.equal(useraccountSaveRes.body._id);
                        (useraccountInfoRes.body.name).should.equal(useraccount.name);
                        should.equal(useraccountInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Useraccount.remove().exec(done);
    });
  });
});
