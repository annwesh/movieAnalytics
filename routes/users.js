var express = require('express');
var router = express.Router();
var configs=require('./../configs');

/* GET users listing. */
router.use('/', function(req, res, next) {
  var users=configs.users;
  

  console.log('inside user'+req.query.name+' '+req.query.age);
  users.forEach(function(user){
  		console.log("checking"+JSON.stringify(user));
  		if(user.Name==req.query.name){
  			console.log('found user');
  			if(user.password==req.query.age){
  				console.log('matching password');
  				req.user=user;
  				next();
  			}
  			
  		}
});
  next('error');
},function(req,res,next){
	console.log('its not working');
	next();
});


router.get('/', function(req, res, next) {
  var users=configs.users;
  

  console.log('inside checky');

  res.render('dashBoard',{Name:req.query.name,user:req.user});
  
});


// // a middleware sub-stack that handles GET requests to the /user/:id path
// router.get('/user/:id', function (req, res, next) {
//   // if the user ID is 0, skip to the next router
//   if (req.params.id === '0') next('route')
//   // otherwise pass control to the next middleware function in this stack
//   else next()
// }, function (req, res, next) {
//   // render a regular page
//   console.log('coming the nextmiddleware');
//   res.send('found');
// });

// // handler for the /user/:id path, which renders a special page
// router.get('/user/:id', function (req, res, next) {
//   console.log(req.params.id)
//   res.send('special');
// })

module.exports = router;
