const FootballField = require('../models/footballFieldModel');
const Reservation = require('../models/reservationModel');
const catchAsync = require('../utils/catchAsync');
const upload = require('../middleware/upload');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.getPublicFields = catchAsync(async (req, res) => {
  const fields = await FootballField.find({ isActive: true })
    .sort({ averageRating: -1 })
    .limit(6);

  res.status(200).json({
    status: 'success',
    results: fields.length,
    data: { fields }
  });
});

exports.getAllFields = catchAsync(async (req, res) => {
  const fields = await FootballField.find({ isActive: true })
    .populate('ownerId', 'firstName lastName email')
    .lean(); // lean() returns plain JS objects

  const updatedFields = fields.map((field) => {
    const isOwnedByCurrentUser =
      req.user && field.ownerId?._id.toString() === req.user._id.toString();
    return { ...field, isOwnedByCurrentUser };
  });

  res.status(200).json({
    status: 'success',
    results: updatedFields.length,
    data: { fields: updatedFields }
  });
});

// ✅ Get single field
exports.getField = async (req, res) => {
  try {
    const field = await FootballField.findById(req.params.id).populate(
      'ownerId',
      'firstName lastName email'
    );

    if (!field) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Football field not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { field }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Middleware to upload field images
exports.uploadFieldImages = upload.uploadFieldImages;

exports.resizeFieldImages = async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  const uploadDir = path.join(__dirname, '../public/img/fields');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  req.body.images = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `field-${Date.now()}-${i}.jpeg`;
      await sharp(file.buffer)
        .resize(800, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(path.join(uploadDir, filename));

      req.body.images.push({
        url: `${req.protocol}://${req.get('host')}/img/fields/${filename}`
      });
    })
  );

  next();
};

// ✅ Create new field
exports.createField = async (req, res) => {
  try {
    let fieldData = req.body.data ? JSON.parse(req.body.data) : { ...req.body };

    if (req.body.images && req.body.images.length > 0) {
      fieldData.images = req.body.images;
    }

    fieldData.ownerId = req.user.id;

    if (!fieldData._id) {
      delete fieldData._id;
    }

    for (const key in fieldData) {
      if (fieldData[key] === '') {
        fieldData[key] = undefined;
      }
    }

    const newField = await FootballField.create(fieldData);

    res.status(201).json({
      status: 'success',
      data: { field: newField }
    });
  } catch (err) {
    console.error('❌ Error while saving field:', err);
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// ✅ Update field (clean version)
exports.updateField = catchAsync(async (req, res) => {
  const fieldId = req.params.id;
  const field = await FootballField.findById(fieldId);

  if (!field) {
    return res.status(404).json({
      status: 'fail',
      message: 'No football field found with that ID'
    });
  }

  // ✅ Permission check
  if (
    req.user.role !== 'admin' &&
    field.ownerId.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not allowed to edit this field'
    });
  }

  // ✅ Parse form-data JSON
  let updatedData = {};
  try {
    updatedData = req.body.data ? JSON.parse(req.body.data) : req.body;
  } catch (err) {
    console.error('Invalid JSON in req.body.data:', err);
    updatedData = {};
  }

  // ✅ Parse removed images
  let removedImages = [];
  try {
    removedImages = req.body.removedImages
      ? JSON.parse(req.body.removedImages)
      : [];
  } catch (err) {
    console.error('Invalid removedImages JSON:', err);
  }

  // ✅ Prepare images
  let existingImages = Array.isArray(field.images) ? [...field.images] : [];
  let newImages = [];

  // If `resizeFieldImages` middleware already added new image URLs
  if (req.body.images && Array.isArray(req.body.images)) {
    newImages = req.body.images;
  }

  // ✅ Remove deleted images from disk and from existing list
  if (removedImages.length > 0) {
    for (const imgUrl of removedImages) {
      const match = imgUrl.match(/\/img\/fields\/([^/]+\.jpeg)$/);
      if (match) {
        const filePath = path.join(__dirname, '../public/img/fields', match[1]);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      existingImages = existingImages.filter((img) => img.url !== imgUrl);
    }
  }

  // ✅ Merge old and new images
  const mergedImages = [...existingImages, ...newImages];

  // ✅ Update the field
  const updatedField = await FootballField.findByIdAndUpdate(
    fieldId,
    { ...updatedData, images: mergedImages },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: { field: updatedField }
  });
});

// ✅ Delete field
exports.deleteField = catchAsync(async (req, res) => {
  const field = await FootballField.findByIdAndDelete(req.params.id);
  if (!field) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Football field not found' });
  }

  res.status(204).json({ status: 'success', data: null });
});

exports.getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, userId } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const field = await FootballField.findById(id);
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    const reservations = await Reservation.find({ field: id, date })
      .populate('player', '_id firstName lastName')
      .lean();

    const openHour = parseInt(field.openTime.split(':')[0]);
    const closeHour = parseInt(field.closeTime.split(':')[0]);
    const availableSlots = [];

    const now = new Date();
    const todayISO = now.toISOString().slice(0, 10); // yyyy-mm-dd

    for (let h = openHour; h < closeHour; h++) {
      const startTime = `${String(h).padStart(2, '0')}:00`;
      const endTime = `${String(h + 1).padStart(2, '0')}:00`;

      // 🚫 Skip past hours if selected date is today
      if (date === todayISO && h <= now.getHours()) {
        continue;
      }

      const reservation = reservations.find(
        (r) => r.startTime === startTime && r.endTime === endTime
      );

      const status = reservation ? reservation.status : 'available';
      const player = reservation?.player
        ? {
            _id: reservation.player._id,
            name: `${reservation.player.firstName || ''} ${
              reservation.player.lastName || ''
            }`.trim()
          }
        : null;

      // 🚫 Skip active & completed slots
      if (status === 'active' || status === 'completed') {
        continue;
      }

      // 🧩 If cancelled by same player → skip
      if (
        status === 'cancelled' &&
        player?._id?.toString() === userId?.toString()
      ) {
        continue;
      }

      // ✅ If cancelled by another player → show as available
      const finalStatus =
        status === 'cancelled' && player?._id?.toString() !== userId?.toString()
          ? 'available'
          : status;

      availableSlots.push({
        id: `${id}-${h}`,
        label: `${startTime} - ${endTime}`,
        startTime,
        endTime,
        status: finalStatus,
        player,
        price: field.pricing || 0
      });
    }

    res.json({ slots: availableSlots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
