const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.register = catchAsync(async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Check all required fields
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

    // generate a jwt token.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({
      status: 'success',
      token,
      data: user
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

exports.login = catchAsync(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check the existence of the email and password
    if (!(email && password)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your email or password is not correct'
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
      status: 'success',
      token,
      data: user
      // token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});
