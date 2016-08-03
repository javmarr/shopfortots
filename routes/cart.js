var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');

var Item = require('../models/Item.js');
var Cart = require('../models/Cart.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var ID = req.session.userId;
  console.log('id used for cart get: ' + ID);
  Cart.find({'userid': ID } ,function(err, cart){
    console.log('cart is: ');
    var itemIdArray = cart[0]['itemid'];
    Item.find({'_id': {$in: itemIdArray}}, function(err, itemInfo){
      console.log(itemInfo);
      res.render('cart', {title: 'Your Cart',  items: itemInfo});
    })
  })
})

router.get('/update', function(req, res, next) {
    var ID = req.session.userId;
    Cart.find({'userid': ID } ,function(err, cart){
      var itemIdArray = cart[0]['itemid'];
      console.log("==" + cart);
      console.log("--" + itemIdArray);
      Item.find({'_id': {$in: itemIdArray}}, function(err,itemInfo){
        console.log(itemInfo);
        req.session.success = 'items saved to cart';
        res.redirect('/');
      });
    });
})

module.exports = router;
