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
//this block of code will use a post then it will take the array of items
//to delete and the user id and use model.find to compare it with the contents
//of the cart[0].itemid and delete ids that are in both lists.
//The result will be saved into a variable then cart[0].itemid will be updated using
//model.update and passing the variable that has the new itemid with items removed.
//We decided not to use the model.delete since it would remove all contents of the itemid instead
//of only removing the array elements we selected.
router.post('/removeItem', function(req,res,next){
  var ID = req.body.userId;
  var newitems = [];
  //console.log('remove array: ' + req.body.removeArray)
  var removeArray = (req.body.removeArray).split(',');
  Cart.find({'userid': ID}, function(err,cart){
    console.log("current items: " + cart[0]['itemid']);
    var currentArray = cart[0]['itemid'];
    console.log("items to be deleted: " + removeArray);
    var newitems = [];
    //this block should check if an id is in the list then it should remove it from the list.
    for (var i = 0; i < currentArray.length; i++){
        if(removeArray.indexOf(currentArray[i]) < 0){
          newitems.push(currentArray[i]);
        }

    }
    console.log('new cart array: '+ newitems);
    Cart.update({'userid': ID}, {
      itemid: newitems}, { multi: true }, function(err, raw){
        if (err) return handleError(err);
        console.log('The raw response from Mongo was ', raw);
      })
  })

  res.redirect('/cart')
})
  ;


module.exports = router;
