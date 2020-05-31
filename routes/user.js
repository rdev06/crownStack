const router = require('express').Router();
const jwt = require('jsonwebtoken');
const userSchema = require('../models/userSchema');
const config = require('../config');

router.post('/register', (req, res) =>
  userSchema
    .create(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => res.status(400).json({ msg: err }))
);

router.post('/login', (req, res) =>
  userSchema
    .findOne({ email: req.body.email })
    .then(user => {
      if (user.password == req.body.password) {
        res.status(200).json({
          msg: 'logged in!',
          token: jwt.sign(
            {
              userId: user._id
            },
            config.jwt_secrect_key,
            {
              expiresIn: config.jwt_expiresIn
            }
          )
        });
      } else {
        res.status(400).json({ msg: 'Incorrect password' });
      }
    })
    .catch(err => res.status(400).json({ msg: err }))
);

module.exports = router;
