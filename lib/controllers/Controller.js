/**
 * This is the base controller class that all controllers should extend from.
 */

// Dependencies
const Token = require('../models/Token');
const User = require('../models/User');

const modelClasses = {
  Token,
  User
}

dynamicClass = function(name) {
  return modelClasses[name];
}

class Controller {
  /**
   * Creates an instance of Controller
   * 
   * @param {string} model
   * @param {array} [allowedMethods=[]]
   * @memberof Controller
   */
  constructor(model, allowedMethods = []) {
    if(allowedMethods.length == 0) {
      this._allowedMethods = ['post','get','put','delete'];
    } else {
      this._allowedMethods = allowedMethods;
    }

    this._model = model;
  }

  /**
   * DELETE HTTPS Request Method
   *
   * @param {object} data
   * @param {function} callback
   * @memberof Controller
   */
  DELETEMethod(data, callback) {
    // Dynamic Model Class Scoping
    let dynamicModel = dynamicClass(this._model);

    // Dynamic model instantiation
    let Model = new dynamicModel('delete', data.queryStringObject,);

    // Check for model validation
    if(Model.valid) {
      if(Model.delete()) {
        callback(200);
        // Check for error that the file does not exist
      } else if(Model.errors.indexOf("ENOENT") > -1) {
        callback(404);
      } else {
        // An internal error occured.
        callback(500);
        console.log(Model.errors);
      }
      
    } else {

      // Return Validation errors or delete errors
      callback(400, Model.errors);
    }
  }

  /**
   * GET HTTPS Request Method
   *
   * @param {object} data
   * @param {function} callback
   * @memberof Controller
   */
  GETMethod(data, callback) {
    // Dynamic Model Class Scoping
    let dynamicModel = dynamicClass(this._model);

    // Dynamic model instantiation
    let Model = new dynamicModel('read', data.queryStringObject);

    // Check for model validation
    if(Model.valid) {

      // Read the entity
      let entity = Model.read();

      // If there is entity data, return it.
      if(entity) {
        callback(200, entity);
      } else {
        callback(404);
      }
    } else {

      // Return Validation errors
      callback(400, Model.errors);
    }
  }

  /**
   * POST HTTPS Request Method
   *
   * @param {object} data
   * @param {function} callback
   * @memberof Controller
   */
  POSTMethod(data, callback) {
    // Dynamic Model Class Scoping
    let dynamicModel = dynamicClass(this._model);

    // Dynamic model instantiation
    let Model = new dynamicModel('create', data.payload);

    // Check for model validation
    if(Model.valid) {

      // Attempt an entity creation
      if(Model.create()) {
        callback(200);
      
      // Check for error that the file already exists (previous registration)
      } else if(Model.errors.indexOf("EEXIST") > -1) {
        callback(400, {'Error': 'That email address has already been registered.'});
      } else {

        // An internal error occured.
        callback(500);
        console.log(Model.errors);
      }
    } else {

      // Return Validation errors
      callback(400, Model.errors);
    }
  }

  /**
   * PUT HTTPS Request Method
   *
   * @param {object} data
   * @param {function} callback
   * @memberof Controller
   */
  PUTMethod(data, callback) {
    // Dynamic model class Scoping
    let dynamicModel = dynamicClass(this._model);

    // Dynamic model instantiation
    let Model = new dynamicModel('update', data.payload);

    // Check for model validation
    if(Model.valid) {

      // Attempt an entity update
      if(Model.update()) {
        callback(200);
      } else {

        // An internal error occured.
        callback(500);
        console.log(Model.errors);
      }
    } else {

      // Return Validation errors
      callback(400, Model.errors);
    }
  }

  /**
   * Method factory for determining the required method based off of HTTPS Request Method
   *
   * @param {object} data
   * @param {function} callback
   * @memberof Controller
   */
  render(data, callback) {
    // Check for allowed methods
    if(this._allowedMethods.indexOf(data.method) > -1){

      // Check for a valid token
      if (!data.headers.token && this.dynamicModel != 'Token') {
        callback(400, {'Error' : 'You must provide a token in the headers of the request.'});
      } else {
        // Instantiate a new Token model
        let TokenModel = new Token('read', {'id': data.headers.token});

        // Try to read the token
        let token = TokenModel.read();

        // Assign the email based on data provided
        let email = ('email' in data.payload) ? data.payload.email : data.queryStringObject.email;

        // Check for token validation
        if(token && token.email == email && token.expires > Date.now()) {
          // Set the method name
          let method = data.method.toUpperCase() + 'Method';
          // Invoke the method
          this[method](data,callback);
        } else {
          callback(403);
        }
      }
    } else {

      // If the requested method is not allowed, return a 405
      callback(405);
    }
  }
}

module.exports = Controller;