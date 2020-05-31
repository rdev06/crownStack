const router = require('express').Router();
const user = require('./user');
const product = require('./product');
const cart = require('./cart');
const ensureLoggedIn = require('../ensuredLoggedIn');

router.use('/user', user);
router.use('/product', product);
router.use('/cart', ensureLoggedIn, cart);

router.get('/', (req, res) => res.send('this api version is in use'));

module.exports = router;
