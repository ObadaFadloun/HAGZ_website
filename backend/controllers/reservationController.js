const footballFieldModel = require('../models/footballFieldModel');
const Reservation = require('../models/reservationModel');

// ✅ Create reservation
exports.createReservation = async (req, res) => {
  try {
    const { field, startTime, endTime, totalPrice, date } = req.body;

    // 1️⃣ Validate required fields
    if (!field || !startTime || !endTime || !totalPrice || !date) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required reservation data'
      });
    }

    // 2️⃣ Verify the field exists
    const foundField = await footballFieldModel.findById(field);
    if (!foundField) {
      return res.status(404).json({
        status: 'fail',
        message: 'Football field not found'
      });
    }

    // 3️⃣ Ensure reservation is not in the past
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${startTime}:00`);
    if (selectedDateTime < now) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot book a past date or time'
      });
    }

    // 4️⃣ Check overlapping reservations for the same field & date
    const overlapping = await Reservation.findOne({
      field,
      date,
      $or: [
        // case 1: start time overlaps
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (overlapping) {
      return res.status(400).json({
        status: 'fail',
        message: 'This slot is already booked. Please select another one.'
      });
    }

    // 5️⃣ Create reservation
    const reservation = await Reservation.create({
      field: foundField._id,
      owner: foundField.ownerId || foundField.owner, // depending on your model field name
      player: req.user._id,
      date,
      startTime,
      endTime,
      totalPrice,
      status: 'active'
    });

    res.status(201).json({
      status: 'success',
      data: { reservation }
    });
  } catch (err) {
    console.error('Reservation creation error:', err);
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Reservation not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: reservation
    });
  } catch (err) {
    console.error('Update reservation error:', err);
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// ✅ Get all reservations for a specific field (used in frontend)
exports.getReservationsByField = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const reservations = await Reservation.find({ field: fieldId }).select(
      'player date startTime endTime status'
    );
    res.status(200).json({
      status: 'success',
      results: reservations.length,
      data: reservations
    });
  } catch (err) {
    console.error('Get reservations error:', err);
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const user = req.user;

    let filter = {};

    if (user.role === 'owner') {
      filter = {
        $or: [
          { player: user._id }, // Reservation made by this user (as player)
          { owner: user._id } // Reservation owned by this user (as owner)
        ]
      };
    } else if (user.role === 'player') {
      filter.player = user._id;
    }

    // Fetch reservations
    const reservations = await Reservation.find(filter)
      .populate('field', 'name owner')
      .populate('player', 'firstName lastName email')
      .sort({ date: -1 });

    res.json({ reservations });
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Cancel reservation (player or admin)
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Reservation not found'
      });
    }

    // Only allow the owner or admin to cancel
    if (
      req.user.role !== 'admin' ||
      reservation.owner.toString() === req.user._id.toString()
    ) {
      return res.status(403).json({
        status: 'fail',
        message: 'Not authorized to cancel this reservation'
      });
    }

    // Update status
    reservation.status = 'cancelled';
    await reservation.save();

    res.status(200).json({
      status: 'success',
      message: 'Reservation cancelled successfully',
      data: reservation
    });
  } catch (err) {
    console.error('Cancel reservation error:', err);
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Reservation not found'
      });
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    console.error('Delete reservation error:', err);
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
