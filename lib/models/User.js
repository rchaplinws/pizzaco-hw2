/**
 * The User model class
 */

// Dependencies
const Model = require('./Model');

class User extends Model {
  constructor(data, crudOp) {
    let fields = [
      {
        "name"      : "name",
        "type"      : "string",
        "length"    : 4
      },
      {
        "name"      : "email",
        "type"      : "string",
        "length"    : 5
      },
      {
        "name"      : "password",
        "type"      : "string",
        "length"    : 8,
        "hash"      : true,
        "access"    : "private"
      },
      {
        "name"      : "street_address",
        "type"      : "string",
        "length"    : 5
      },
      {
        "name"      : "city",
        "type"      : "string",
        "length"    : 3
      },
      {
        "name"      : "state",
        "type"      : "string",
        "length"    : 4
      },
      {
        "name"      : "zipcode",
        "type"      : "number",
        "length"    : 5
      },
      {
        "name"      : "role",
        "type"      : "string",
        "length"    : 5,
        "default"   : "customer",
        "access"    : "protected"
      }
    ];

    super(crudOp, data, "users", "email", fields);
  }
}

module.exports = User;