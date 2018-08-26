// Dependencies
const Model = require('./Model');

/**
 * The Token Model Class
 *
 * @class Token
 * @extends {Model}
 */
class Token extends Model {
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
        "length"    : 5
      },
      {
        "name"      : "expires",
        "type"      : "number"
      }
    ];

    super(crudOp, data, "tokens", "id", fields);
  }
}

module.exports = Token;