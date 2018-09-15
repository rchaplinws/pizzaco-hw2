/**
 * Utility module with misc functions
 */

// Dependencies
var config = require('./server/config');
var crypto = require('crypto');
var https = require('https');

let utils = {};

// Create a string of random alphanumeric characters, of a given length
utils.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    var str = '';
    for(i = 1; i <= strLength; i++) {
        // Get a random charactert from the possibleCharacters string
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

        // Append this character to the string
        str+=randomCharacter;
    }

    // Return the final string
    return str;
  } else {
    return false;
  }
};

// Create a SHA256 hash
utils.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Create an object from a JSON string
utils.parseJsonToObject = function(str){
  try{
    return JSON.parse(str);
  } catch(error){
    return {};
  }
};

utils.sendHttpsRequest = function(payload, requestDetails, callback) {

  // Create the request object
  const req = https.request(requestDetails,(res) => {
    // Grab the status of the sent request
    const status =  res.statusCode;

    // Callback successfully if the request went through
    if(status == 200 || status == 201){
      callback(true);
    } else {
      callback(false);
    }
  });

  req.on('error', function(e) {
    callback(false);
  });

  // Add the payload to the request
  req.write(payload);

  // End the request
  req.end();
};

module.exports = utils;