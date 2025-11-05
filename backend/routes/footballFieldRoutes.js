const express = require('express');
const footballFieldController = require('../controllers/footballFieldController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/public', footballFieldController.getPublicFields);

router.route('/:id').get(footballFieldController.getField);

// Protect all routes below
router.use(authController.protect);

router.route('/').get(footballFieldController.getAllFields).post(
  footballFieldController.uploadFieldImages, // multer middleware
  footballFieldController.resizeFieldImages, // resize & save URLs
  footballFieldController.createField // save to DB
);

router
  .route('/:id')
  .get(footballFieldController.getField)
  .patch(
    footballFieldController.uploadFieldImages,
    footballFieldController.resizeFieldImages,
    footballFieldController.updateField
  )
  .delete(
    authController.restrictTo('admin'),
    footballFieldController.deleteField
  );

router.get('/:id/available-slots', footballFieldController.getAvailableSlots);

module.exports = router;
