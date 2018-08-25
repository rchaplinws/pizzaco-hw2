/**
 * The Customer Controller
 */

// Dependencies
const Controller = require('./Controller');

class Customer extends Controller {
    constructor() {
      super();
      this.allowedMethods = ['post'];
    }
}

module.exports = Customer;