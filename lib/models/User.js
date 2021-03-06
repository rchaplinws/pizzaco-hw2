/**
 * The User model class
 */

// Dependencies
const Model = require('./Model');

class User extends Model {
  constructor(crudOp, data) {
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
      },
      {
        "name"      : "cart",
        "type"      : "string",
        "length"    : 20,
        "default"   : ""
      },
      {
        "name"      : "orders",
        "type"      : "object",
        "length"    : 0,
        "default"   : []
      }
    ];

    super(crudOp, data, "users", "email", fields);
  }
}

module.exports = User;