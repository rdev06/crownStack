const jwt = require('jsonwebtoken');
const config = require('./config');
module.exports = (req, res, next) => {
  function verifyUser(token) {
    jwt.verify(token, config.jwt_secrect_key, (err, decode) => {
      if (err) {
        console.log(err);
        res.status(400).json({ msg: 'Auth Failed!!' });
      } else {
        req.user = decode;
        next();
      }
    });
  }
  if (req.headers.authorization) {
    try {
      const getToken = req.headers.authorization.split(' ');
      getToken[0] == 'Bearer'
        ? verifyUser(getToken[1])
        : res
            .status(404)
            .json({ msg: 'Bearer token is not present in the authorization' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'Auth Failed!!' });
    }
  } else {
    res.status(404).json({ msg: 'Authorisation headeris not present' });
  }
};
