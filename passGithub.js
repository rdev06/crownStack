const crypto = require('crypto');
const config = require('./config');
const hmac = crypto.createHmac('sha1', config.deployPass);

module.exports = (req, res, next) => {
  const digest = 'sha1=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  const checksum = req.get('X-Hub-Signature');
  if (!checksum || !digest || checksum !== digest) {
    res.status(401).json({
      msg: 'Check for application/json',
      error: 'Server Ip or secrect not match'
    });
  } else {
    next();
  }
};
