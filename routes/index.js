var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shop for Tots', items:[{
  id: "10",
  title: 'toy1' ,
  price: 1,
  image: 'http://www.toysrus.com/graphics/tru_prod_images/Barbie-Cash-Register-Play-Set--pTRU1-15652628dt.jpg'
  },{
  id: "20",
  title: 'toy2' ,
  price: 3,
  image: 'http://www.toysrus.com/graphics/tru_prod_images/Baby-Alive-Super-Snacks-Snackin--pTRU1-23516132dt.jpg'
  }]
  })

});


module.exports = router;
