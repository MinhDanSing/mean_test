'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Userclient = mongoose.model('Userclient'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  fs = require('fs'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Client = mongoose.model('Userclient'),
  validator = require('validator');
/**
 * Create a Userclient
 */
exports.create = function (req, res) {
  var userclient = new Userclient(req.body);
  userclient.user = req.user;

  userclient.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userclient);
    }
  });
};

/**
 * Show the current Userclient
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var userclient = req.userclient ? req.userclient.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  userclient.isCurrentUserOwner = req.user && userclient.user && userclient.user._id.toString() === req.user._id.toString();

  res.jsonp(userclient);
};

/**
 * Update a Userclient
 */
exports.update = function (req, res) {
  var userclient = req.userclient;

  userclient = _.extend(userclient, req.body);

  userclient.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userclient);
    }
  });
};

/**
 * Delete an Userclient
 */
exports.delete = function (req, res) {
  var userclient = req.userclient;

  userclient.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userclient);
    }
  });
};

/**
 * List of Userclients
 */
exports.list = function (req, res) {
  var userid = req.user._id;
  Userclient.find({ 'user' : userid }).sort('-created').populate( 'user', 'displayName').exec(function (err, userclients) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userclients);
    }
  });
};

/**
 * Userclient middleware
 */
exports.userclientByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Userclient is invalid'
    });
  }

  Userclient.findById(id).populate('user', 'displayName').exec(function (err, userclient) {
    if (err) {
      return next(err);
    } else if (!userclient) {
      return res.status(404).send({
        message: 'No Userclient with that identifier has been found'
      });
    }
    req.userclient = userclient;
    next();
  });
};
exports.saveuser = function (req, res) {

  var reqClient = null;
  // Filtering to upload only images
  var multerConfig = config.uploads.profile.clientimage;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newProfilePicture');
  var existingImageUrl;

  uploadImage()
    .then(deleteOldImage)
    .then(saveClient)
    .then(function () {
      res.json(reqClient);
    })
    .catch(function (err) {
      res.status(422).send(err);
    });
  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function saveClient() {
    return new Promise(function (resolve, reject) {
      reqClient = new Userclient(req.body.clientdata);
      if (req.file) {
        reqClient.clientImageURL = config.uploads.profile.clientimage.dest + req.file.filename;
      } else {
        reqClient.clientImageURL = Client.schema.path('clientImageURL').defaultValue;
      }
      if (req.body.clientdata._id) {
        var newitem = _.omit(req.body.clientdata, '_id');
        newitem.clientImageURL = reqClient.clientImageURL;
        Userclient.update({_id: req.body.clientdata._id}, {$set: newitem}, function (err, numAffected) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });

      } else {

        reqClient.user = req.user;
        reqClient.save(function (err, theuser) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }

    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {

      existingImageUrl = req.body.clientdata.clientImageURL;
      if (existingImageUrl !== Client.schema.path('clientImageURL').defaultValue && req.body.clientdata._id) {
        fs.exists(existingImageUrl, function(exists) {
          if (exists) {
            fs.unlink(existingImageUrl, function (unlinkError) {
              if (unlinkError) {
                console.log(unlinkError);
                reject({
                  message: 'Error occurred while deleting old profile picture'
                });
              } else {
                resolve();
              }
            });
          }else{
            resolve();
          }
        });

      } else {
        resolve();
      }
    });
  }

};
