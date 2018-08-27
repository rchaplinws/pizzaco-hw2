// Dependencies
const Cart = require('../models/Cart');
const Controller = require('./Controller');
const User = require('../models/User');
const utilities = require('../utils');

/**
 * The Carts Controller
 *
 * @class Carts
 * @extends {Controller}
 */
class Carts extends Controller {
  /**
   * Creates an instance of Carts.
   * 
   * @memberof Carts
   */
  constructor() {
    super('Cart');
  }

  /**
   * DELETE HTTPS Request Method - Delete the cart and update the associated user
   *
   * @param {*} data
   * @param {*} callback
   * @memberof Carts
   */
  deleteMethod(data, callback) {
    if(this._authUser.cart == '') {
      callback(400, {"Error": "This account doesn't have a cart associated with it."})
    } else {
      let CartModel = new Cart('delete', {"id" : this._authUser.cart});
      if(CartModel.delete()) {
        this._updateUser({"email" : this._authUser.email, "cart":""}, callback);
      } else {
        callback(500);
        console.log(CartModel.errors);
      }
    }
  }

  /**
   * GET HTTPS Request Method - Get the cart
   *
   * @param {object} data
   * @param {function} callback
   * 
   * @memberof Carts
   */
  getMethod(data, callback) {
    if(this._authUser.cart == '') {
      callback(400, {"Error": "This account doesn't have a cart associated with it."})
    } else {
      let CartModel = new Cart('read', {"id" : this._authUser.cart});
      let cart = CartModel.read();
      if(cart) {
        callback(200, cart);
      } else {
        callback(500);
        console.log(CartModel.errors);
      }
    }
  }

  /**
   * POST HTTPS Request Method - Create a cart and associate it with the correct user
   *
   * @param {object} data
   * @param {function} callback
   * 
   * @memberof Carts
   */
  postMethod(data, callback) {
    // Check if there is an existing cart for this user account
    if(this._authUser.cart != '') {
      callback(400, {"Error" : "This account already has a cart."})
    } else {
      // Create an id for the cart
      data.payload.id = utilities.createRandomString(20);

      // Instantiate a Cart model
      let CartModel = new Cart('create', data.payload);

      // Check if the Cart is valid
      if(CartModel.valid) {

        // Attempt to create the cart
        if(CartModel.create()) {
          this._updateUser({"email" : this._authUser.email, "cart":data.payload.id}, callback);
        } else {
          // Cart server errors
          callback(500);
          console.log(CartModel.errors);
        }
      } else {
        callback(400, CartModel.errors);
      } 
    }
  }

  /**
   * PUT HTTPS Request Method - This will update the cart items
   *
   * @param {object} data
   * @param {function} callback
   * 
   * @memberof Carts
   */
  putMethod(data, callback) {
    data.payload.id = this._authUser.cart;
    let CartModel = new Cart('update', data.payload);
    if(CartModel.valid) {
      // Attempt an entity update
      if(CartModel.update()) {
        callback(200);
      } else {
        // An internal error occured.
        callback(500);
        console.log(CartModel.errors);
      }
    } else {
      callback(400, CartModel.errors);
    }
  }

  /**
   * Internal function to update the User associated with this cart
   *
   * @param {object} data
   * @param {function} callback
   * 
   * @memberof Carts
   */
  _updateUser(data, callback) {
    // Instantiate a User Model
    let UserModel = new User('update', data);

    // Attempt to update the user with the new cart id
    if(UserModel.update()){
      callback(200);
    } else {
      // User server errors
      callback(500);
      console.log(UserModel.errors);
    }
  }
}

module.exports = Carts;