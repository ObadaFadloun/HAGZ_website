const dotenv = require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

const AppError = require('./utils/appError');
const globelErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRouters');
const authRouter = require('./routes/authRouters');
const ownerRequestRouter = require('./routes/ownerRequestRoutes')

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // your frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE',],
    credentials: true
  })
);

app.use('/img', express.static(path.join(__dirname, 'public/img')));

// 1) Globel middleware
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
// app.use(mongoSnaitize());

// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    // whitelist: ['duration']
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/ownerRequests', ownerRequestRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globelErrorHandler);

module.exports = app;
