var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');

var stripe = require("stripe")("sk_test_mREOe68nWf34dXNmIAO0DvyF");

var Item = require('../models/Item.js');
var Cart = require('../models/Cart.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  Item.find(function(err, docs){
    res.locals.error = req.session.error;
    res.locals.success= req.session.success;
    req.session.error = null;
    req.session.success = null;
    res.render('index', {title: 'Shop for Tots', items: docs});
  });
});

router.get('/checkout', function(req, res, next) {
  var ID = req.session.userId;
  if(ID) {
    console.log('----');
    console.log('(in-session) id used for cart get: ' + ID);
    console.log('----');

    Cart.find({'userid': ID } ,function(err, cart){
      console.log('cart is: ');
      var itemIdArray = cart[0]['itemid'];
      Item.find({'_id': {$in: itemIdArray}}, function(err, itemInfo){
        console.log(itemInfo);
        res.render('checkout', {title: 'Checkout Items',  items: itemInfo});
      });
    });
  } else {
    req.session.error = 'User id not valid';
    res.redirect('/');
  }
})

router.get('/updateSession.json', function(req, res, next) {
  console.log('received message');
  // var hour = 3600000;
  temp = req.session.user;
  req.session.user = temp;

  console.log(req.session.cookie.maxAge);
  res.send('hello');
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/'
  }), function(req, res){
    res.redirect('/');
});

router.get('/logout', function(req, res, next){
  console.log('id: ' + req.session.userId);
  req.session.userId = undefined;
  console.log('id after delete: ' + req.session.userId);
  req.logout();
  res.redirect('/');
});
// this block of code takes the arrayform contents and checks if it has something in it
// if there is then it adds it to the cart
// if there are duplicates it finds the user's db entry
// then it updates the cart with a new list containing both the old and new entries

router.post('/update', function(req, res, next) {
  console.log(req.body.cartArray);
  if(req.body.cartArray!==""){

    var cart = new Cart({
      userid: req.body.userId,
      itemid: req.body.cartArray.split(',')
    });
    cart.save(function(err){
      if(err){
        if (err.name == 'MongoError' && err.code == '11000'){
          console.log('Duplicate user cart');
          Cart.find({'userid': req.body.userId}, function(err, docs){
            console.log(docs);
            console.log(docs[0]['itemid']);
            console.log(docs[0]['userid']);
            console.log("body cart array " + req.body.cartArray);

            var newCartItems = docs[0]['itemid'].concat(req.body.cartArray.split(','));
            console.log("new cart " + newCartItems);
            newCartItems = removeDup(newCartItems);
            console.log("new cart " + newCartItems);
          Cart.update({'userid': req.body.userId}, {
            itemid: newCartItems}, { multi: true }, function(err, raw){
              if (err) return handleError(err);
              console.log('The raw response from Mongo was ', raw);
            })
          })
        }
      }
    });
    res.redirect('/cart/update');
  }
});


/* POST charge page. */
router.post('/charge', function(req, res, next) {
  // (Assuming you're using express - expressjs.com)
  // Get the credit card details submitted by the form
  var stripeToken = req.body.stripeToken;

  var charge = stripe.charges.create({
    amount: 1000, // amount in cents, again
    currency: "usd",
    source: stripeToken,
    description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
      res.send('failure');
    }
  });
  res.send('user token');
});


function removeDup(arr){

  console.log('arr'+arr);
  var output = arr;
  for(var i=0; i<output.length; ++i) {
    for(var j=i+1; j<output.length; ++j) {
        if(output[i] === output[j])
            output.splice(j--, 1);
    }
  }
  console.log('output'+output)
  return output;
}
module.exports = router;
