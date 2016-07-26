var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
url: {type: String, required: true}
title: {type: String, required: true},
price: {type: String, required: true},
image: String
});

module.exports = mongoose.model('Item', ItemSchema);
