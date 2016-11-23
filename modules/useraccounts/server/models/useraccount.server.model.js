'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Useraccount Schema
 */
var UseraccountSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Useraccount name',
    trim: true
  },
  nation: {
    type: String,
    default: '',
    required: 'Please fill Useraccount nation',
    trim: true
  },
  country: {
    type: String,
    default: '',
    required: 'Please fill Useraccount country',
    trim: true
  },
  vpn: {
    type: String,
    default: '',
    required: 'Please fill Useraccount vpn',
    trim: true
  },
  ip: {
    type: String,
    default: '',
    required: 'Please fill Useraccount ip',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill Useraccount email',
    trim: true
  },
  skype: {
    type: String,
    default: '',
    required: 'Please fill Useraccount skype',
    trim: true
  },
  link: {
    type: String,
    default: '',
    required: 'Please fill Useraccount link',
    trim: true
  },
  jobtitle: {
    type: String,
    default: '',
    required: 'Please fill Useraccount jobtitle',
    trim: true
  },
  skill: {
    type: String,
    default: '',
    required: 'Please fill Useraccount skill',
    trim: true
  },
  overview: {
    type: String,
    default: '',
    required: 'Please fill Useraccount overview',
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

mongoose.model('Useraccount', UseraccountSchema);
