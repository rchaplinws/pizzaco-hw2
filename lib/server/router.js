/**
 * This is the main router file, used for defining routes to controllers.
 */
// Dependencies
const controllers = require('./lib/controllers');
let router = {};

router.controllers = {
    'customers' : controllers.customers,
    // 'drivers'   : controllers.drivers,
    // 'orders'    : controllers.orders,
    // 'tokens'    : controllers.tokens
};

module.exports = router;