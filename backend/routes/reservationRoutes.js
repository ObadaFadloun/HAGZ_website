const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authController = require('../controllers/authController');

// --------------------- PLAYER ROUTES ---------------------

router.use(authController.protect);

router
  .route('/')
  .post(reservationController.createReservation)
  .get(reservationController.getReservations);

router.patch('/:id/cancel', reservationController.cancelReservation);

router.get('/field/:fieldId', reservationController.getReservationsByField);

router.route('/:id').patch(reservationController.updateReservation);

router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
