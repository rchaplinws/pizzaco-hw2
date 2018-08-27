// Dependencies
const Model = require('./Model');

/**
 * The Cart Model Class
 *
 * @class Cart
 * @extends {Model}
 */
class Cart extends Model {
  constructor(crudOp, data) {
    let fields = [
      {
        "name"      : "id",
        "type"      : "string",
        "length"    : 20,
        "access"    : "protected"
      },
      {
        "name"      : "email",
        "type"      : "string",
        "length"    : 5,
        "access"    : "protected"
      },
      {
        "name"      : "items",
        "type"      : "object",
        "length"    : 1
      }
    ];

    super(crudOp, data, "carts", "id", fields);
  }
}

module.exports = Cart;