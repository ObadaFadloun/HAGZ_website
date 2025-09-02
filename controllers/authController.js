const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return (token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  }));
};

exports.register = catchAsync(async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!(firstName && lastName && email && password && confirmPassword)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please enter all required fields'
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    });

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      data: user,
      token
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.checkPassword(password))) {
      return next(new AppError('Your email or password is not correct', 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      data: user,
      token
    });
  } catch (err) {
    console.error(err);
    return next(new AppError('Server error', 500));
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not looged in! Please log in to get access.', 401)
    );
  }

  // 2) verification token.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) check if user changed password after the tiken was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
