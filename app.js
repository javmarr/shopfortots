var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var helmet = require('helmet')
var passport = require('passport');
var session = require('express-session');

require('dotenv').config();


var routes = require('./routes/index');
var addnew = require('./routes/addnew');
var users = require('./routes/users');
var cart = require('./routes/cart');

// db connection
var mongoose = require('mongoose');
const MONGO_HOST = process.env.OPENSHIFT_MONGODB_DB_HOST;
const MONGO_PORT = process.env.OPENSHIFT_MONGODB_DB_PORT;
const MONGO_PASSWORD = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;
const DB_NAME = 'shopfortots';

if(MONGO_HOST) {
  mongoose.connect('mongodb://admin:' + MONGO_PASSWORD + '@' + MONGO_HOST + ':' + MONGO_PORT + '/' + DB_NAME);
}
else {
  mongoose.connect('mongodb://localhost/' + DB_NAME);
}
// db ===

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
  secret: 'toys for cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } //10 minutes
}));

app.use(logger('dev'));
app.use(cookieParser());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  if(req.user)
  {
    console.log(req.user);
    req.session.userId = req.user.facebookId;
    res.locals.user = req.user; // ensure all views can see the authenticate user
  }
  next();
});
var User = require('./models/User.js');

app.use('/', routes);
app.use('/users', users);
app.use('/addnew', addnew);
app.use('/cart', cart);

var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL
}, function(accessToken, refreshToken, profile, cb) {
    User.findOne({ facebookId: profile.id }, function (err, user) {
      if (err) return cb(err);
      if (user) return cb(null, user);
      user = new User({
        facebookId: profile.id,
        profile: profile
      });
      user.save(function(err){
        if (err) return cb(err);
        cb(null, user);
      });
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});
passport.deserializeUser(function(id, cb) {
  User.findOne(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
