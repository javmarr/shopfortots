var express = require('express');
var router = express.Router();

var Item = require('../models/Item.js')

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


module.exports = router;
