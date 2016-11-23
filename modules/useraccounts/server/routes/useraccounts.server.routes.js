'use strict';

/**
 * Module dependencies
 */
var useraccountsPolicy = require('../policies/useraccounts.server.policy'),
  useraccounts = require('../controllers/useraccounts.server.controller');

module.exports = function(app) {
  // Useraccounts Routes
  app.route('/api/useraccounts').all(useraccountsPolicy.isAllowed)
    .get(useraccounts.list)
    .post(useraccounts.create);

  app.route('/api/useraccounts/:useraccountId').all(useraccountsPolicy.isAllowed)
    .get(useraccounts.read)
    .put(useraccounts.update)
    .delete(useraccounts.delete);

  // Finish by binding the Useraccount middleware
  app.param('useraccountId', useraccounts.useraccountByID);
};
