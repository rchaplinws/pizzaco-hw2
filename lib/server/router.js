/**
 * This is the main router file, used for defining routes to controllers.
 */
// Dependencies
const Carts = require('../controllers/Carts');
const Menus = require('../controllers/Menus');
const NotFound = require('../controllers/NotFound');
const Tokens = require('../controllers/Tokens');
const Users = require('../controllers/Users');
let router = {};

router.controllers = {
    'carts'    : new Carts(),
    'menus'    : new Menus(),
    'notFound'  : new NotFound(),
    // 'orders'    : new Orders(),
    'tokens'    : new Tokens(),
    'users'     : new Users()
};

module.exports = router;