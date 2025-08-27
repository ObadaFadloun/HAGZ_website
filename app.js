const dotenv = require('dotenv').config({ path: './config.env' });
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRouter');

const app = express();

//middlewares

app.use(express.json());
app.use(morgan('dev'));

//test url
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello there! 😊'
  });
});

app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;
