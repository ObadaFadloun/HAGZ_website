const OwnerRequest = require('../models/ownerRequestModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// 🟡 Player sends a request
exports.createOwnerRequest = catchAsync(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new AppError('User not authenticated', 401));
  }

  // Step 1: Prevent duplicate requests
  const existingRequest = await OwnerRequest.findOne({
    user: req.user.id,
    status: 'pending'
  });

  if (existingRequest) {
    return res.status(400).json({
      status: 'fail',
      message: 'You already have a pending owner request.'
    });
  }

  // Step 2: Create a new record
  const request = await OwnerRequest.create({
    user: req.user.id
  });

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { ownerRequestStatus: 'pending' },
    { new: true }
  );

  // Step 4: Send response
  res.status(201).json({
    status: 'success',
    message: 'Owner request sent successfully!',
    user: updatedUser,
    data: { request }
  });
});

// 🔵 Admin view all requests
exports.getAllRequests = catchAsync(async (req, res) => {
  const { type } = req.query;

  let filter = {};
  if (type === 'new') {
    filter.status = 'pending';
  } else if (type === 'previous') {
    filter.status = { $ne: 'pending' };
  }

  const requests = await OwnerRequest.find(filter).populate(
    'user',
    'firstName lastName email role'
  );

  res
    .status(200)
    .json({ status: 'success', results: requests.length, data: { requests } });
});

// 🟢 Admin approve request
exports.approveRequest = catchAsync(async (req, res, next) => {
  const request = await OwnerRequest.findById(req.params.id);
  if (!request) {
    return next(new AppError('Request not found', 404));
  }

  const user = await User.findById(request.user);
  user.role = 'owner';
  await user.save();

  request.status = 'approved';
  await request.save();

  res.status(200).json({
    status: 'success',
    message: 'User promoted to owner',
    data: { user }
  });
});

// 🔴 Admin reject request
exports.rejectRequest = catchAsync(async (req, res, next) => {
  const request = await OwnerRequest.findById(req.params.id);
  if (!request) {
    return next(new AppError('Request not found', 404));
  }

  request.status = 'rejected';
  await request.save();

  res.status(200).json({ status: 'success', message: 'Request rejected' });
});
