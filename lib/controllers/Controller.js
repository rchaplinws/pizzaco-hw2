/**
 * This is the base controller class that all controllers should extend from.
 */

// Dependencies
const User = require('../models/User');

const modelClasses = {
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
      this._allowedMethods = [];
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
    let Model = new dynamicModel(data.queryStringObject, 'delete');

    // Check for model validation and attempt a delete
    if(Model.valid && Model.delete()) {
      callback(200);
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
    let Model = new dynamicModel(data.queryStringObject, 'read');

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
    let Model = new dynamicModel(data.payload, 'create');

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
    let Model = new dynamicModel(data.payload, 'update');

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
  render(data,callback) {
    // Check for allowed methods
    if(this._allowedMethods.indexOf(data.method) > -1){

      // Set the method name
      let method = data.method.toUpperCase() + 'Method';

      // Invoke the method
      this[method](data,callback);
    } else {

      // If the requested method is not allowed, return a 405
      callback(405);
    }
  }
}

module.exports = Controller;