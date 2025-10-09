const multer = require('multer');
const AppError = require('../utils/appError');

// Store in memory (you can later upload to Cloudinary, S3, etc.)
const multerStorage = multer.memoryStorage();

// Only accept images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports = upload;
