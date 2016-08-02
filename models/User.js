var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  facebookId: String,
  profile: Object,
  cart: Object, //these are added to render items in the cart on the user's cart page
  purchased: Object // we will put each item.
});

module.exports = mongoose.model('User', UserSchema);
