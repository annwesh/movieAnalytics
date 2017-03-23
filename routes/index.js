var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('here it is ');
  res.render('index', { title: 'Express' });
});


router.get('/dobo', function(req, res, next) {
  console.log('here it is ');
  res.send('cool world');
});

module.exports = router;