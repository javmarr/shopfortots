var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('addnew', { title: 'Shop for Tots' });
});

router.post('/', function(req, res, next) {
  console.log(req.body.url);
});

module.exports = router;
