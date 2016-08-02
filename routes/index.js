var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');


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

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/'
}), function(req, res){
  res.redirect('/');
});
router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});
router.post('/', function(req, res, next) {
  console.log(req.body.cartArray);

  var cart = new Cart({
    userid: req.body.userId,
    itemid: req.body.cartArray.split(',')
  });
  req.session.userId = req.body.userId;
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
        })
      }
    }
  });
  res.redirect('/cart');
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
