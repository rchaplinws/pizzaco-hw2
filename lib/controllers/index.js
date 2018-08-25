/**
 * This is the module file for Controllers
 */

// Dependencies
let Customer = require('./Customer');
let controllers = {};

controllers.customers = new Customer();

module.exports = controllers;