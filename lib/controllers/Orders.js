// Dependencies
const config =  require('../server/config');
const Cart = require('../models/Cart');
const Controller = require('./Controller');
const Menu = require('../models/Menu');
const utilities = require('../utils');
const querystring = require('querystring');

/**
 * The Orders Controller
 *
 * @class Orders
 * 
 * @extends {Controller}
 */
class Orders extends Controller {
  /**
   * Creates an instance of Orders.
   * 
   * @memberof Orders
   */
  constructor() {
    super('Order', ['get', 'post']);
  }

  /**
   * GET HTTPS Request method - This will get a list of previous orders
   *
   * @param {object} data
   * @param {function} callback
   * 
   * @memberof Orders
   */
  getMethod(data, callback) {
    callback(200);
  }

  /**
   * POST HTTPS Request method
   *
   * @param {object} data
   * @param {function} callback
   * 
   * @memberof Orders
   */
  postMethod(data, callback) {
    // Check that there is a cart for the auth user
    if(this._authUser.cart == '') {
      callback(400, {"Error": "This account doesn't have a cart associated with it."})
    } else {
      // Calculate Cost
      let amount = 0;

      // Read the cart contents
      let CartModel = new Cart('read', {"id" : this._authUser.cart});
      let cart = CartModel.read();

      // Loop through the cart contents
      for (var category in cart) {

        // Read the menu for the given cart category
        let MenuModel = new Menu('read', {"cat": category});
        let menu = MenuModel.read();

        // Loop through the items in each category
        for (var item in cart[category]) {
          // Loop through the menu items
          for (var menuItem in menu[category]) {
            // If the item is equal to the menu item id, add it to the total.
            if (cart[category][item] == menu[category][menuItem]['id']) {
              amount += menu[category][menuItem]['price'];
            }
          }
        }
      }
      amountCents = amount * 100;
      // Build Payload
      let currency = config.stripe.currency;
      let source = config.stripe.source;
      const swipePayload = {
          amountCents,
          currency,
          source,
          'description': 'Sample Pizza Order',
        };
      let swipePayloadString = querystring.stringify(swipePayload);

      // Build Request details
      const request = {
        'protocol' : 'https:',
        'hostname' : 'api.stripe.com',
        'method' : 'POST',
        'path' : '/v1/charges',
        'auth' : config.stripe.token_sk,
        'headers' : {
          "Content-Type" : 'application/x-www-form-urlencoded',
          "Content-Length": Buffer.byteLength(swipePayloadString)
        }
      };

      // Make Stripe call
      utilities.sendHttpsRequest(swipePayloadString, request, function(response){

        if (response) {

          // Make Mailgun Call
          let mailgunPayload = {
            'from' : 'Mailgun Sandbox <postmaster@sandbox503350313bbe4a59b0eb39a358f22055.mailgun.org>',
            'to' : this._authUser.email,
            'subject' : 'Your Pizza Order',
            'text' : 'Congratulations!, You just ordered pizza! You are truly awesome! You paid $' + amount
          };
          let mailgunPayloadString = querystring.stringify(mailgunPayload);
  
          // Build Request details
          const mailgunRequest = {
            'protocol' : 'https:',
            'hostname' : 'api.mailgun.net',
            'method' : 'POST',
            'path' : '/v3/sandbox503350313bbe4a59b0eb39a358f22055.mailgun.org/messages',
            'auth' : config.mailgun.apikey,
            'headers' : {
              "Content-Type" : 'application/x-www-form-urlencoded',
              "Content-Length": Buffer.byteLength(mailgunPayloadString)
            }
          };
          utilities.sendHttpsRequest(mailgunPayloadString, mailgunRequest, function(response){
            console.log(response);
          });
          callback(200);
  
        } else {
          callback(500);
        }
      });
    }
  }
}

module.exports = Orders;