/**
 * This is the main router file, used for defining routes to controllers.
 */
// Dependencies
const controllers = require('../controllers');
let router = {};

router.controllers = {
    'customers' : controllers.customers,
    // 'drivers'   : controllers.drivers,
    'notFound'  : controllers.notFound,
    // 'orders'    : controllers.orders,
    // 'tokens'    : controllers.tokens
};

module.exports = router;