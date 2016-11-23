'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Useraccount = mongoose.model('Useraccount'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Useraccount
 */
exports.create = function(req, res) {
  var useraccount = new Useraccount(req.body);
  useraccount.user = req.user;

  useraccount.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(useraccount);
    }
  });
};

/**
 * Show the current Useraccount
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var useraccount = req.useraccount ? req.useraccount.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  useraccount.isCurrentUserOwner = req.user && useraccount.user && useraccount.user._id.toString() === req.user._id.toString();

  res.jsonp(useraccount);
};

/**
 * Update a Useraccount
 */
exports.update = function(req, res) {
  var useraccount = req.useraccount;

  useraccount = _.extend(useraccount, req.body);

  useraccount.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(useraccount);
    }
  });
};

/**
 * Delete an Useraccount
 */
exports.delete = function(req, res) {
  var useraccount = req.useraccount;

  useraccount.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(useraccount);
    }
  });
};

/**
 * List of Useraccounts
 */
exports.list = function(req, res) {
  Useraccount.find().sort('-created').populate('user', 'displayName').exec(function(err, useraccounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(useraccounts);
    }
  });
};

/**
 * Useraccount middleware
 */
exports.useraccountByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Useraccount is invalid'
    });
  }

  Useraccount.findById(id).populate('user', 'displayName').exec(function (err, useraccount) {
    if (err) {
      return next(err);
    } else if (!useraccount) {
      return res.status(404).send({
        message: 'No Useraccount with that identifier has been found'
      });
    }
    req.useraccount = useraccount;
    next();
  });
};
