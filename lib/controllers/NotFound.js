/**
 * The NotFound Controller
 */

// Dependencies
const Controller = require('./Controller');

class NotFound extends Controller {
  render(data, callback){
    callback(404);
  }
}

module.exports = NotFound;