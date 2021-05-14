var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Importing sequelize instance 
const { sequelize } = require("./models");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//Using a static route and the express.static method to serve te static files located in the public folder
app.use('/static', express.static('public'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error();
  console.log('Error 404');
  err.status = 404;
  err.message = 'Uh-oh, you are looking for a page that does not exist! Please try again.'
  res.render('page-not-found', { err });
});

// 500 global error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log('Error 500');
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  if(err.status == 404) {
    res.render('page_not_found', { title: "Page Not Found", error: err});
  } else if (err.status === undefined) {
    err.status = 500;
    err.message = 'Oh no! There was an error on the server.';
    res.render('error', { title: "Page Not Found", error: err});
  }
});
//Use the sequelize.sync() method to sync the model with the database
(async() => {
 try {
   //validate connection
    await sequelize.authenticate();
    console.log('Hooray! Connection established.');
    await sequelize.sync({ force: true});
    console.log('All models were synchronized to the database!');
  //log error to console
 } catch (error) {
   console.log('Uh oh! Connection has not been established.', error);
 }
}
) ();





module.exports = app;
