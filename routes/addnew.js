var express = require('express');
var router = express.Router();
var ParseURL = require('../public/javascript/parser.js');
var Item = require('../models/Item.js');


function addItem(req, res, next) {
  // has non numeric characters
  req.session.error = 'Quantity has to be a number';
  res.redirect('/inventory');
  let item = new Item({
    url: result.url,
    title: result.title,
    image: result.image,
    price: result.price
  });

  item.save(function(err){
    if (err){
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
    res.redirect('/index');
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
  Item.find(function(err, docs){
    // same as: {error : req.session.error}
    res.locals.error = req.session.error;
    res.locals.success= req.session.success;
    req.session.error = null;
    req.session.success = null;
    res.render('addnew', {title: 'Shop for Tots', items: docs});
  });
});

router.post('/', function(req, res, next) {
  console.log(`Finding: ${req.body.url}`);

  ParseURL(req.body.url, function(err, result){
    var act = req.body.act;
    if (err) return next(err);

    // if (act === "all") return getInventory(req, res, next);
    if (act === "add") return addItem(req, res, next);
    // if (act === "update") return updateItem(req, res, next);
    // if (act === "remove") return removeBeads(req,res, next);
  });
});

module.exports = router;
