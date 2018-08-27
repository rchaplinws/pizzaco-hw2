// Dependencies
const Controller = require('./Controller');

/**
 * Not Found Controller -- 404 Error.
 *
 * @class NotFound
 * @extends {Controller}
 */
class NotFound extends Controller {
  render(data, callback){
    let view = [
      " _    _   _______   _    _ ",
      "|:|  |:| [:::::::] |:|  |:|",
      "|:|  |:| |:|   |:| |:|  |:|",
      "|:|__|:| |:|   |:| |:|__|:|",
      "|::::::| |:|   |:| |::::::|",
      "`````|:| |:|   |:| `````|:|",
      "     |:| |:|   |:|      |:|",
      "     |:| |:|   |:|      |:|",
      "     |:| |:|   |:|      |:|",
      "     |:| [:::::::]      |:|",
      "     CHECK YOUR ENDPOINT.  "
    ];
    callback(404, {'Error': view});
  }
}

module.exports = NotFound;