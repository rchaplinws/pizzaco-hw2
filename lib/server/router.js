/**
 * This is the main router file, used for defining routes to controllers.
 */
// Dependencies
const controllers = require('../controllers');
let router = {};

router.controllers = {
    'users'         : controllers.users,
    'notFound'      : controllers.notFound,
    // 'orders'    : controllers.orders,
    // 'tokens'    : controllers.tokens
};

module.exports = router;