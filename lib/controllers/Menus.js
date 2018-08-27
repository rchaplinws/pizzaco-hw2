// Dependencies
const Controller = require('./Controller');

/**
 * The Menu Controller
 *
 * @class Menus
 * @extends {Controller}
 */
class Menus extends Controller {
  /**
   * Creates an instance of Menus.
   * 
   * @memberof Menus
   */
  constructor() {
    super('Menu', ['get']);
  }
}

module.exports = Menus;