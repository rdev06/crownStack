const router = require('express').Router();
const productSchema = require('../models/productSchema');
router.get('/', (req, res) =>
  productSchema
    .find()
    .then(products => res.status(200).json(products))
    .catch(err => res.status(400).json({ msg: err }))
);

router.post('/add', (req, res) =>
  productSchema
    .create(req.body)
    .then(products => res.status(201).json(products))
    .catch(err => res.status(400).json({ msg: err }))
);
module.exports = router;
