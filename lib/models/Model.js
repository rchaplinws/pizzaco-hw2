/**
 * The parent class Model that all of the data models should extend
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const utilities = require('../utils');

class Model {
  /**
   * Creates an instance of Model
   * 
   * @param {string} crudOp   - Which CRUD Operation ius being performed
   * @param {object} data     - The data to be consumed
   * @param {string} dataDir  - The directory name of the model
   * @param {string} primary  - The primary field to be used as identification of a entity
   * @param {array}  fields   - An array of field objects to be used for validation
   * 
   * @memberof Model
   */
  constructor(crudOp, data, dataDir, primary, fields) {
    this._baseDir = path.join(__dirname,'/../../.data/');
    this._crudOp = crudOp;
    this._data = data;
    this._dataDir = this._baseDir + dataDir;
    this._errors = [];
    this._fields = fields;
    this._primary = primary;
    this._valid = false;
    this._validate();
  }

  /**
   * Get the errors for this model.
   */
  get errors() {
    return this._errors;
  }

  /**
   * Get the valid state of this model.
   */
  get valid() {
    return this._valid;
  }

  /**
   * The create method of CRUD
   */
  create() {
    // Create a string from the supplied data
    let stringData = JSON.stringify(this._data);

    // Create a file path based on the primary field from the data provided
    let filePath = this._dataDir + '/' + this._data[this._primary] + '.json';

    // Try the various fs functions and catch errors
    try {
      // Open the file
      let fileDescriptor = fs.openSync(filePath, 'wx');

      // Write the file
      fs.writeFileSync(fileDescriptor, stringData);

      // Close the file
      fs.closeSync(fileDescriptor);

      return true;

    // Catch any errors and push them to the model error array
    } catch(error) {
      // Check for an error code and push it or else just push the error. This is intended to be used for previous creation validation.
      if (error.code) {
        this._errors.push(error.code);
      } else {
        this._errors.push(error);
      }

      return false;
    }
  }

  /**
   * The read method of CRUD
   */
  read() {
    // Try the various fs functions and catch errors
    try {
      let contents = fs.readFileSync(this._dataDir + '/' + this._data[this._primary] + '.json', 'utf8');

      // Return the contents as an object
      let entity = utilities.parseJsonToObject(contents);

      // Loop through the fields and remove protected or private data from the entity
      this._fields.forEach(function(field){
        if(field.access == 'private' || field.access == 'protected') {
          delete entity[field.name];
        }
      }, this);

      return entity;
    
    // Catch the errors and push them to the model.errors array
    } catch(error) {
      this._errors.push(error);
  
      return false;
    }
  }

  /**
   * The update method of CRUD
   * 
   * @returns boolean - True if success.
   */
  update() {
    // Create a file path based on provided data.
    let filePath = this._dataDir + '/' + this._data[this._primary] + '.json';

    // Try the various fs functions and catch errors
    try {
      // Open the file for read/write
      let fileDescriptor = fs.openSync(filePath, 'r+');

      // Get the contents of the current entity
      let contents = fs.readFileSync(fileDescriptor);

      // Parse the string contents to an object
      let entity = utilities.parseJsonToObject(contents);

      // Loop through the model fields and assign the incoming data
      this._fields.forEach(function(field){
        if(this._data[field.name] && entity[field.name]) {
          entity[field.name] = this._data[field.name];
        }
      }, this);

      // Truncate the file
      fs.truncateSync(fileDescriptor);

      // Write the new data to the file
      fs.writeFileSync(fileDescriptor, JSON.stringify(entity));

      // Close the file.
      fs.closeSync(fileDescriptor);

      return true;
  } catch(error) {
      this._errors.push(error);

      return false;
    }
  }

  /**
   * The delete method of CRUD
   */
  delete() {
    // Create a file path based on provided data.
    let filePath = this._dataDir + '/' + this._data[this._primary] + '.json';

    try {
      // Unlink the file from the filesystem
      fs.unlinkSync(filePath);

      return true;
    } catch(error) {
      this._errors.push(error);

      return false;
    }
  }

  /**
   * Validate the data set, produce errors, and set the vaild state.
   */
  _validate() {
    // Loop through all of the defined fields for the model.
    this._fields.forEach(function(field){

      // Check to see if the field has been set at all.
      if(this._data[field.name]) {

        // Validate the data type based on field definition
        if(typeof(this._data[field.name]) != field.type) {
          this._errors.push('The field: ' + field.name + ' is not of type: ' + field.type);
        }

        // Validate the trimmed length of the field if it is a string.
        if(field.type == 'string' && this._data[field.name].trim().length < field.length) {
          this._errors.push('The field: ' + field.name + ' should be at least ' + field.length + ' characters long.', );

        // Validate the length if it is a number.
        } else if(field.type == 'number' && Math.ceil(Math.log(this._data[field.name] + 1) / Math.LN10) != field.length) {
          this._errors.push('The field: ' + field.name + ' should be exactly ' + field.length + ' characters long.', );
        }

        // Validate that the primary field is at least set, or all fields if creating an entity.
      } else if(this._data[field.name] === this._primary || this._crudOp == 'create' && !field.default) {
        this._errors.push('The field: ' + field.name + ' is required, but has been left empty.');
      }

      // Check that more than one field is supplied if it is an update operation
      if (this._data.length <= 1 && this._crudOp == 'update') {
        this._errors.push('This operation requires more than just the ' + this._primary + ' field to update the records.');
      }

      // Check for ACL level and remove data from the request that shouldn't be 
      if (field.name in this._data && field.access === 'protected') {
        delete this._data[field.name];
      }

      // Check for hashable fields and hash if they exist. 
      if (field.name in this._data && field.hash) {
        this._data[field.name] = utilities.hash(this._data[field.name]);
      }

      // Apply any default values to missing fields
      if (!(field.name in this._data) && field.default) {
        this._data[field.name] = field.default;
      }
    }, this);

    // Set the model to valid if there are not any errors.
    if(this.errors.length == 0) {
      this._valid = true;
    } else {
      this._valid = false;
    }
  }
}

module.exports = Model;