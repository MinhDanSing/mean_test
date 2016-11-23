'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Userclient = mongoose.model('Userclient'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  userclient;

/**
 * Userclient routes tests
 */
describe('Userclient CRUD tests', function () {

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

    // Save a user to the test db and create new Userclient
    user.save(function () {
      userclient = {
        name: 'Userclient name'
      };

      done();
    });
  });

  it('should be able to save a Userclient if logged in', function (done) {
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

        // Save a new Userclient
        agent.post('/api/userclients')
          .send(userclient)
          .expect(200)
          .end(function (userclientSaveErr, userclientSaveRes) {
            // Handle Userclient save error
            if (userclientSaveErr) {
              return done(userclientSaveErr);
            }

            // Get a list of Userclients
            agent.get('/api/userclients')
              .end(function (userclientsGetErr, userclientsGetRes) {
                // Handle Userclients save error
                if (userclientsGetErr) {
                  return done(userclientsGetErr);
                }

                // Get Userclients list
                var userclients = userclientsGetRes.body;

                // Set assertions
                (userclients[0].user._id).should.equal(userId);
                (userclients[0].name).should.match('Userclient name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Userclient if not logged in', function (done) {
    agent.post('/api/userclients')
      .send(userclient)
      .expect(403)
      .end(function (userclientSaveErr, userclientSaveRes) {
        // Call the assertion callback
        done(userclientSaveErr);
      });
  });

  it('should not be able to save an Userclient if no name is provided', function (done) {
    // Invalidate name field
    userclient.name = '';

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

        // Save a new Userclient
        agent.post('/api/userclients')
          .send(userclient)
          .expect(400)
          .end(function (userclientSaveErr, userclientSaveRes) {
            // Set message assertion
            (userclientSaveRes.body.message).should.match('Please fill Userclient name');

            // Handle Userclient save error
            done(userclientSaveErr);
          });
      });
  });

  it('should be able to update an Userclient if signed in', function (done) {
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

        // Save a new Userclient
        agent.post('/api/userclients')
          .send(userclient)
          .expect(200)
          .end(function (userclientSaveErr, userclientSaveRes) {
            // Handle Userclient save error
            if (userclientSaveErr) {
              return done(userclientSaveErr);
            }

            // Update Userclient name
            userclient.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Userclient
            agent.put('/api/userclients/' + userclientSaveRes.body._id)
              .send(userclient)
              .expect(200)
              .end(function (userclientUpdateErr, userclientUpdateRes) {
                // Handle Userclient update error
                if (userclientUpdateErr) {
                  return done(userclientUpdateErr);
                }

                // Set assertions
                (userclientUpdateRes.body._id).should.equal(userclientSaveRes.body._id);
                (userclientUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Userclients if not signed in', function (done) {
    // Create new Userclient model instance
    var userclientObj = new Userclient(userclient);

    // Save the userclient
    userclientObj.save(function () {
      // Request Userclients
      request(app).get('/api/userclients')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Userclient if not signed in', function (done) {
    // Create new Userclient model instance
    var userclientObj = new Userclient(userclient);

    // Save the Userclient
    userclientObj.save(function () {
      request(app).get('/api/userclients/' + userclientObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', userclient.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Userclient with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userclients/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Userclient is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Userclient which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Userclient
    request(app).get('/api/userclients/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Userclient with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Userclient if signed in', function (done) {
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

        // Save a new Userclient
        agent.post('/api/userclients')
          .send(userclient)
          .expect(200)
          .end(function (userclientSaveErr, userclientSaveRes) {
            // Handle Userclient save error
            if (userclientSaveErr) {
              return done(userclientSaveErr);
            }

            // Delete an existing Userclient
            agent.delete('/api/userclients/' + userclientSaveRes.body._id)
              .send(userclient)
              .expect(200)
              .end(function (userclientDeleteErr, userclientDeleteRes) {
                // Handle userclient error error
                if (userclientDeleteErr) {
                  return done(userclientDeleteErr);
                }

                // Set assertions
                (userclientDeleteRes.body._id).should.equal(userclientSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Userclient if not signed in', function (done) {
    // Set Userclient user
    userclient.user = user;

    // Create new Userclient model instance
    var userclientObj = new Userclient(userclient);

    // Save the Userclient
    userclientObj.save(function () {
      // Try deleting Userclient
      request(app).delete('/api/userclients/' + userclientObj._id)
        .expect(403)
        .end(function (userclientDeleteErr, userclientDeleteRes) {
          // Set message assertion
          (userclientDeleteRes.body.message).should.match('User is not authorized');

          // Handle Userclient error error
          done(userclientDeleteErr);
        });

    });
  });

  it('should be able to get a single Userclient that has an orphaned user reference', function (done) {
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

          // Save a new Userclient
          agent.post('/api/userclients')
            .send(userclient)
            .expect(200)
            .end(function (userclientSaveErr, userclientSaveRes) {
              // Handle Userclient save error
              if (userclientSaveErr) {
                return done(userclientSaveErr);
              }

              // Set assertions on new Userclient
              (userclientSaveRes.body.name).should.equal(userclient.name);
              should.exist(userclientSaveRes.body.user);
              should.equal(userclientSaveRes.body.user._id, orphanId);

              // force the Userclient to have an orphaned user reference
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

                    // Get the Userclient
                    agent.get('/api/userclients/' + userclientSaveRes.body._id)
                      .expect(200)
                      .end(function (userclientInfoErr, userclientInfoRes) {
                        // Handle Userclient error
                        if (userclientInfoErr) {
                          return done(userclientInfoErr);
                        }

                        // Set assertions
                        (userclientInfoRes.body._id).should.equal(userclientSaveRes.body._id);
                        (userclientInfoRes.body.name).should.equal(userclient.name);
                        should.equal(userclientInfoRes.body.user, undefined);

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
      Userclient.remove().exec(done);
    });
  });
});
