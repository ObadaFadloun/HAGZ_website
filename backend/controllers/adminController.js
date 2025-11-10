const Reservation = require('../models/reservationModel');

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalBookings = await Reservation.countDocuments();
    const activePlayers = (await Reservation.distinct('player')).length;

    const revenueResult = await Reservation.aggregate([
      { $match: { status: { $in: ['active', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const revenue = revenueResult[0]?.total || 0;

    const recentBookings = await Reservation.find()
      .populate('player', 'firstName lastName')
      .populate('field', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('player field date status');

    res.status(200).json({
      totalBookings,
      activePlayers,
      revenue,
      recentBookings
    });
  } catch (err) {
    console.error('❌ Admin dashboard error:', err.message);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
};
