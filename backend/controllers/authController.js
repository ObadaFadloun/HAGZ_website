const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const FootballField = require('../models/footballFieldModel')
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  if (!process.env.JWT_EXPIRES_IN) {
    throw new Error('JWT_EXPIRES_IN is not defined');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user: userObj }
  });
};

exports.register = catchAsync(async (req, res) => {
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

  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res) => {
  const { email, password, reactivate } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide email and password'
    });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkPassword(password, user.password))) {
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect email or password'
    });
  }

  if (!user.active && user.deletedAt) {
    const diffInDays =
      (Date.now() - new Date(user.deletedAt).getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays > 30) {
      return res.status(410).json({
        status: 'fail',
        message:
          'Your account has been permanently deleted after 30 days. Please register again.'
      });
    }

    if (!reactivate) {
      return res.status(403).json({
        status: 'inactive',
        message:
          'Your account is currently deactivated. Would you like to recover it?'
      });
    }

    // Reactivate account
    user.active = true;
    user.deletedAt = null;
    await user.save({ validateBeforeSave: false });

    // If user is an owner, recover all their football fields
    if (user.role === 'owner') {
      await FootballField.updateMany(
        { ownerId: user._id },
        { $set: { isActive: true } }
      );
    }
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.'
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return res.status(401).json({
      status: 'fail',
      message: 'The user belonging to this token no longer exists.'
    });
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      status: 'fail',
      message: 'User recently changed password! Please log in again.'
    });
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'No user found with this email address'
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `http://localhost:5173/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\nIf you didn't request this, ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      status: 'fail',
      message: 'There was an error sending the email. Try again later!'
    });
  }
});

exports.resetPassword = catchAsync(async (req, res) => {
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      status: 'fail',
      message: 'Token is invalid or expired'
    });
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.checkPassword(req.body.passwordCurrent, user.password))) {
    return res.status(401).json({
      status: 'fail',
      message: 'Your current password is incorrect'
    });
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  createSendToken(user, 200, res);
});
