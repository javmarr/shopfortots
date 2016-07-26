var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('addnew', { title: 'Shop for Tots' });
});

module.exports = router;
