// Dependencies
const Controller = require('./Controller');
const Token = require('../models/Token');
const User = require('../models/User');
const utilities = require('../utils');

/**
 *
 *
 * @class Tokens
 * 
 * @extends {Controller}
 */
class Tokens extends Controller {
  /**
   * Creates an instance of Tokens.
   * 
   * @memberof Tokens
   */
  constructor() {
    super('Token', ['post','delete']);
  }

  postMethod(data, callback) {
    let UserModel = new User('token', data.payload);
    if(UserModel.valid) {
      let user = UserModel.read(false);
      if (user) {
        if(data.payload.password === user.password) {
          var tokenId = utilities.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60 *24;
          var tokenObject = {
            'id' : tokenId,
            'email': data.payload.email,
            'expires' : expires
          };

          let TokenModel = new Token('create', tokenObject);
          if(TokenModel.valid) {
            if(TokenModel.create()) {
              callback(200, {'id':tokenId});
            } else {
              callback(500);
              console.log('Token create error.');
            }
          } else {
            callback(500);
            console.log('Token valid error.');
            console.log(TokenModel.errors);
          }
        } else {
          callback(401);
        }
      } else {
        callback(404);
      }
    } else {
      callback(400, UserModel.errors);
    }
  }
}

module.exports = Tokens;