var express = require('express');
var router = express.Router();
var ParseURL = require('../public/javascript/parser.js');
var Item = require('../models/Item.js');


function addItem(result, req, res, next) {
  // has non numeric characters
  // req.session.error = 'Quantity has to be a number';
  console.log(JSON.stringify(result, null, '  '));
  let item = new Item({
    url: result.url,
    title: result.title,
    image: result.image,
    price: result.price
  });

  item.save(function(err){
    if (err){
      console.log('---SAVE ERROR---');
      var isEmpty = err.message.indexOf("validation failed") !== -1;
      // var dupIndex = err.message.indexOf("dup key:");
      // var isDup = dupIndex !== -1;
      // console.log(err);
      // console.log('===');
      if(isEmpty){
        // console.log(err.message);
        req.session.error = 'Error: No Empty Fields Allowed';
      }
    }
    res.redirect('/');
  });
}

/*
function updateItem(req, res, next) {
  console.log(req.body);
  var newQty = req.body.qtyText;
  var id = req.body.id;
  // console.log(`id: ${id} | ${newQty}`);
  Bead.findOne({id: id}, function(err, doc) {
    // console.log(`found one: ${doc}`);
    if(doc) {
      doc.qty = newQty;
      doc.save(function(err){
        if (err) next(err);
        req.session.success = "Update Successful";
        res.redirect('/inventory');
      });
    } else {
      req.session.error = "Unknown Error, Unable to Update Value";
      res.redirect('/inventory');
    }
  });
}

function removeBeads(req, res, next) {
  var removeList = req.body.removeList.split(',');
  console.log(removeList);
  for (i in removeList) {
    id = removeList[i];
    console.log(id);
    // Bead.remove({id: id});
    Bead.find({id: id}).remove().exec();
  }
  res.redirect('/inventory');
}
*/

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('addnew', {title: 'Shop for Tots'});
});

router.post('/', function(req, res, next) {
  console.log(`Got post: ${req.body.url}`);

  ParseURL(req.body.url, function(err, result){
    var act = req.body.act;
    if (err) return next(err);
    // if (act === "all") return getInventory(req, res, next);
    addItem(result, req, res, next);
    // if (act === "update") return updateItem(req, res, next);
    // if (act === "remove") return removeBeads(req,res, next);
  });
});

module.exports = router;
