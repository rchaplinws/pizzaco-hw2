// Dependencies
const Model = require('./Model');

/**
 * The Order Model Class
 *
 * @class Order
 * @extends {Model}
 */
class Order extends Model {
  constructor(crudOp, data) {
    let fields = [
      {
        "name"      : "id",
        "type"      : "string",
        "length"    : 20
      },
      {
        "name"      : "email",
        "type"      : "string",
        "length"    : 20,
        "access"    : "protected"
      },
      {
        "name"      : "id",
        "type"      : "string",
        "length"    : 20
      },
    ];

    super(crudOp, data, "orders", "id", fields);
  }
}

module.exports = Order;