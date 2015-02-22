var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/mysite?auto_reconnect', {safe:true});

//menu
var activeMenu = require('active-menu');
// Create a New Instance
var adminMenu = new activeMenu('adminMenu');
// Set HTML Attributes for the Top <ul> element
adminMenu.setAttributes({class : 'menu', id : 'admin-menu'});
// Home Node
var homeNode = adminMenu.addMenuNode('Home', '/');
homeNode.setAttributes({class : 'home home-icon', id : 'home-link'});

var postsNode = adminMenu.addMenuNode('About', '/about');
postsNode.setAttributes({class : 'about about-icon'});

var newPostNode = postsNode.addMenuNode('Contact', '/contact');
newPostNode.setAttributes({class : 'contact-post contact-icon'});

var app = express();

// Use Menu
app.use(adminMenu.menu);

//routes
app.get('/', function(req, res){
  res.render('index', {
    title: 'Home'
  });
});

app.get('/about', function(req, res){
  res.render('about', {
    title: 'About'
  });
});

app.get('/contact', function(req, res){
  res.render('contact', {
    title: 'Contact'
  });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//db stuff
app.use(function(req, res, next) {
  req.db = {};
  req.db.tasks = db.collection('tasks');
  next();
})
app.locals.appname = 'Express.js Todo App'

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('stylus').middleware(path.join(__dirname, 'public')));

//cach limit
var oneDay = 86400000;

app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneDay }));

app.use('/', routes);
app.use('/users', users);

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
