var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request=require('request');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose=require('mongoose');
var passport=require('passport');
var session = require('express-session');
var configDB=require('./configs/configDB');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var logger = require('./configs/logConfig');


/*logger.add(winston.transports.Console, {
 level: 'warn',
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: false
});*/
console.log(configDB.url);
mongoose.connect(configDB.url);
require('./models/passport')(passport);

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session());

logger.log('info', 'Hello distributed log files!');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use('/images',express.static(path.join(__dirname, 'public/images')))
app.use('/css',express.static(path.join(__dirname, 'public')));

app.use('/', routes);
logger.log('info','routes set up');

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email','https://www.googleapis.com/auth/plus.login'] }));

    // the callback after google has authenticated the user
app.get('/oauth/google/callback',
        passport.authenticate('google', {
                 successRedirect : '/profile',
                 failureRedirect : '/'
        }));

app.get('/profile', function(req, res) {
        console.log('https://www.googleapis.com/plus/v1/people/'+req.user.google.id);


          request({
            url: 'https://www.googleapis.com/plus/v1/people/'+req.user.google.id, //URL to hit
            qs: {access_token:req.user.google.token}, //Query string data
            method: 'GET', //Specify the method

          }, function(error, response, body){
                  if(error) {
                      console.log(error);
                  } else {
                      console.log(response.statusCode, body);
                }
          });





        res.render('profile', {
            user : req.user // get the user out of session and pass to template
          });
    });


app.use('/users', users);
logger.log('info','users working fine');

app.get('/searchResults',function(req,res,next){

    console.log('search result data'+req.query.inputData);
    res.setHeader('Content-Type', 'application/json');
    var options = {
  url: 'http://localhost:8008/messenger/webapi/profiles',
  headers: {
    'User-Agent': 'request'
  }
};

    var info =null;
    request(options,function(err,response,body){
        if(body!=null){
        info= JSON.parse(body);
        console.log(body);
        res.send(JSON.stringify(info[0]));
        }
        else {next(err);}
      
    });
    

    
  
});

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log('coming here');
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
*/
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  logger.log('warn','couldnot find it');
  res.render('error', {
    message: err.message,
    error: {}
  });
});

logger.warn('errors not handled');

app.listen(3000);

logger.info('server started at port 3000.............');
