var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sequelRouter = require('./routes/tasksSequelizer');
var sequelUsersRouter = require('./routes/usersSequelizer');

var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/sequelUsers', sequelUsersRouter);
app.use('/sequel', sequelRouter);
app.use('/user', usersRouter);
app.use('/', indexRouter);

  
module.exports = app;
