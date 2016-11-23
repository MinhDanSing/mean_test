'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator');

/**
 * Userclient Schema
 */
var UserclientSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill client name',
    trim: true
  },
  email: {
    type: String,
    default: '',
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    required: 'Please fill client email',
    trim: true
  },
  country: {
    type: String,
    default: '',
    required: 'Please fill client country',
    trim: true
  },
  devproject: {
    type: String,
    default: '',
    trim: true
  },
  clientImageURL: {
    type: String,
    default: 'modules/userclients/client/img/profile/default.png'
  },
  comment: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Userclient', UserclientSchema);
