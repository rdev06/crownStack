const router = require('express').Router();
const userSchema = require('../models/userSchema');

router.get('/', (req, res) =>
  userSchema
    .findById(req.user.userId)
    .select('cart')
    .populate('cart', '-__v')
    .then(user => res.status(200).json(user.cart))
    .catch(err => res.status(400).json({ msg: err }))
);

router.post('/add', (req, res) =>
  userSchema
    .findByIdAndUpdate(
      req.user.userId,
      {
        $addToSet: { cart: req.body.pId }
      },
      { new: true }
    )
    .select('cart')
    .then(user =>
      res.status(201).json({ msg: user.cart.indexOf(req.body.pId) != -1 })
    )
    .catch(err => res.status(400).json({ msg: err }))
);

module.exports = router;
