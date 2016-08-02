var mongoose = require('mongoose');

var CartSchema = new mongoose.Schema({
  userid: {type: String, required: true, unique: true},
  itemid: {type: Array, required: true}
});


module.exports = mongoose.model('Cart', CartSchema);
