var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shop for Tots', items:[{
  id: "10",
  title: 'toy1' ,
  price: 1,
  image: 'stuff'
  },{
  id: "20",
  title: 'toy2' ,
  price: 3,
  image: 'stuffy'
  }]
  })

});


module.exports = router;
