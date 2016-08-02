var express = require('express');
var validator = require('validator');
var router = express.Router();
var ParseURL = require('../public/javascript/parser.js');
var Item = require('../models/Item.js');


function addItem(result, req, res, next) {
  // has non numeric characters
  // req.session.error = 'Quantity has to be a number';
  console.log(JSON.stringify(result, null, '  '));
  var item = new Item({
    url: result.url,
    title: result.title,
    image: result.image,
    price: result.price
  });

  item.save(function(err){
    if (err){
      console.log('---SAVE ERROR---');
      if (err.name == 'MongoError' && err.code == '11000'){
        console.log('Duplicate key');
        req.session.error = {
          message: 'Item is already on the list'
        };
        res.redirect('/addnew');
      }
      console.log(err.name);
      console.log(err.code);
    } else {
      req.session.success = 'Item added';
      res.redirect('/');
    }
  });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.locals.error = req.session.error;
  res.locals.success= req.session.success;
  req.session.error = null;
  req.session.success = null;
  res.render('addnew', { title: 'Shop for Tots' });
});

// handle URL POST form
router.post('/', function(req, res, next) {
  // console.log(`Got post: ${req.body.url}`);

  // error found, redirect and show
  if (!validator.isURL(req.body.url)) {
    var msg = 'Input is not a valid URL.';
    req.session.error = {
      message: msg
    };
    return res.redirect('/addnew');
  }
  else {
    // try to parseURL
    ParseURL(req.body.url, function(err, result){
        if (err) {
          // error from parser
          req.session.error = {
            message: err
          };
          return res.redirect('/addnew');
        }
        var act = req.body.act;
        // if (act === "all") return getInventory(req, res, next);
        addItem(result, req, res, next);
        // if (act === "update") return updateItem(req, res, next);
        // if (act === "remove") return removeBeads(req,res, next);
      });
  }
});

/* error hanlding done:
 * invalid URL
 * unsuported URL (site which Parser is not able to scrape)
 * empty URL
 */
module.exports = router;
