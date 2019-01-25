const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./router');
const port = process.env.PORT;

//use sessions for tracking logins
app.use(session({
  secret: 'cytellix',
  resave: true,
  saveUninitialized: false,
  ephemeral: true
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from template
app.use(express.static(__dirname));

// include routes
app.use('/', routes);

// catch 404
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port 3000
app.listen(port, function () {
  console.log('Express app listening on port 3000')
})