/**
 * This is the module file for Controllers
 */

// Dependencies
const Customer = require('./Customer');
const NotFound = require('./NotFound');
let controllers = {};

controllers.customers = new Customer();
controllers.notFound = new NotFound();

module.exports = controllers;