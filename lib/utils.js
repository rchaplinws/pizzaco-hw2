/**
 * Utility module with misc functions
 */

// Dependencies
var config = require('./server/config');
var crypto = require('crypto');

let utils = {};

// Create a SHA256 hash
utils.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

utils.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

module.exports = utils;