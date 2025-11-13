const sharp = require('sharp'); // 🟢 You need this for image resizing
const User = require('../models/userModel');
const FootballField = require('../models/footballFieldModel');
const Reservation = require('../models/reservationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upload');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// 🧩 1. Middleware to handle single image upload (field: profileImage)
exports.uploadUserPhoto = upload.uploadProfilePic;

// 🧩 2. Resize image and set its path in req.body
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const uploadDir = path.join(__dirname, '../public/img/users');

  // 🔧 Ensure folder exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(uploadDir, filename));

  req.body.profileImage = `${req.protocol}://${req.get('host')}/img/users/${filename}`;
  next();
});

// 🧩 3. Update profile picture field in DB
exports.updateProfilePicture = catchAsync(async (req, res, next) => {
  if (!req.body.profileImage) {
    return next(new AppError('Please upload an image first', 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { profileImage: req.body.profileImage },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    user: updatedUser
  });
});

// 🧩 4. Update profile info (no passwords or image here)
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  } else if (req.body.profileImage) {
    return next(
      new AppError(
        'This route is not for profile picture updates. Please use /updateProfilePicture',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ active: true });
  if (!users) {
    return next(new AppError('No users found!', 404));
  }
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // 🧠 Cascade cleanup
  if (user.role === 'player') {
    await Reservation.deleteMany({ player: user._id });
  }

  if (user.role === 'owner') {
    const fields = await FootballField.find({ ownerId: user._id });
    const fieldIds = fields.map((f) => f._id);

    await FootballField.updateMany({ ownerId: user._id }, { isActive: false });
    await Reservation.deleteMany({
      $or: [
        { field: { $in: fieldIds }, status: 'active' }, // correct
        { player: user._id, status: 'active' }
      ]
    });
  }

  // 🧠 Soft delete user
  await User.findByIdAndUpdate(user._id, {
    active: false,
    deletedAt: Date.now()
  });

  res.status(204).json({
    status: 'success',
    message:
      'Account deactivated. You can reactivate within 30 days by logging in.'
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found',
    });
  }

  // Cascade cleanup (same as before)
  if (user.role === 'player') {
    await Reservation.deleteMany({ player: user._id });
  }

  if (user.role === 'owner') {
    const fields = await FootballField.find({ ownerId: user._id });
    const fieldIds = fields.map((f) => f._id);

    await FootballField.deleteMany({ _id: { $in: fieldIds } });
    await Reservation.deleteMany({
      $or: [
        { field: { $in: fieldIds }, status: 'active' },
        { player: user._id, status: 'active' },
      ],
    });
  }

  // 🚫 Instead of deleting — block the user
  user.isBlocked = true;
  user.active = false;
  user.deletedAt = Date.now();
  await user.save({ validateBeforeSave: false });

  res.status(204).json({
    status: 'success',
    message: 'User has been blocked and all related data removed.',
  });
});
