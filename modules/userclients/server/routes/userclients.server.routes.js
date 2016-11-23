'use strict';

/**
 * Module dependencies
 */
var userclientsPolicy = require('../policies/userclients.server.policy'),
  userclients = require('../controllers/userclients.server.controller');

module.exports = function(app) {
  // Userclients Routes
  app.route('/api/userclients').all(userclientsPolicy.isAllowed)
    .get(userclients.list)
    .post(userclients.create);

  app.route('/api/userclients/:userclientId').all(userclientsPolicy.isAllowed)
    .get(userclients.read)
    .put(userclients.update)
    .delete(userclients.delete);

  app.route('/api/userclients_saveuser').post(userclients.saveuser);

  // Finish by binding the Userclient middleware
  app.param('userclientId', userclients.userclientByID);
};
