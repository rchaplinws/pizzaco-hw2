/**
 * This is the module file for Controllers
 */

// Dependencies
const Users = require('./Users');
const NotFound = require('./NotFound');
let controllers = {};

controllers.users = new Users();
controllers.notFound = new NotFound();

module.exports = controllers;