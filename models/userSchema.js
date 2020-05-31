const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }]
});
module.exports = mongoose.model('user', userSchema);
