var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  facebookId: String,
  profile: Object
});

module.exports = mongoose.model('User', UserSchema);
