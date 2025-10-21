const multer = require('multer');
const AppError = require('../utils/appError');

// Store in memory (for cloud upload or later processing)
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

// ✅ Middleware for single profile picture
const uploadProfilePic = upload.single('profileImage');

// ✅ Middleware for football field images
const uploadFieldImages = upload.array('images', 6);

module.exports = { uploadProfilePic, uploadFieldImages };
