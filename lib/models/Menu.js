// Dependencies
const Model = require('./Model');

/**
 * The Menu Model Class
 *
 * @class Menu
 * @extends {Model}
 */
class Menu extends Model {
  constructor(crudOp, data) {
    let fields = [
      {
        "name"      : "cat",
        "type"      : "string",
        "length"    : 3
      }
    ];

    super(crudOp, data, "menus", "cat", fields);
  }
}

module.exports = Menu;