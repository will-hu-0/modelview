var compression = require('compression')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var entities = require('./routes/entities');
var slides = require('./routes/slides');
var common = require('./util/common.js');

var app = express();

var oneMonth = 2592000000;
//var oneMonth =1;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), {maxAge: oneMonth}));

app.use('/', routes);
app.use('/users', users);
app.use('/entities', entities);
app.use('/slides', slides);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  err.message = "The page you requested not found...";
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      style:common.getTheme(req),
      message: err.message,
      status:err.status,
      error: err,
      title: "ERROR | View Model"
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    style:common.getTheme(req),
    message: err.message,
    status:err.status,
    error: {},
    title: "ERROR | View Model"
  });
});

module.exports = app;
