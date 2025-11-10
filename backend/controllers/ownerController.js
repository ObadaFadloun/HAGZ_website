const Reservation = require('../models/reservationModel');
const FootballField = require('../models/footballFieldModel');

exports.getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        // 1️⃣ Fetch fields owned by this owner
        const fields = await FootballField.find({ ownerId: ownerId }).select(
            '_id name'
        );

        if (!fields.length) {
            return res.json({
                earnings: 0,
                totalBookings: 0,
                latestReservations: [],
                fields: []
            });
        }

        // 2️⃣ Get all field IDs
        const fieldIds = fields.map((f) => f._id);

        // 3️⃣ Fetch latest reservations for those fields
        const reservations = await Reservation.find({ field: { $in: fieldIds } })
            .populate('player', 'firstName lastName')
            .populate('field', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // 4️⃣ Calculate total earnings
        const earningsAgg = await Reservation.aggregate([
            {
                $match: {
                    field: { $in: fieldIds },
                    status: { $in: ['active', 'completed'] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalPrice' }
                }
            }
        ]);

        const earnings = earningsAgg[0]?.total || 0;

        // 5️⃣ Count total bookings
        const totalBookings = await Reservation.countDocuments({
            field: { $in: fieldIds }
        });

        // 6️⃣ Prepare reservations for frontend
        const latestReservations = reservations.map((r) => {
            return {
                player: {
                    firstName: r.player?.firstName || 'Unknown',
                    lastName: r.player?.lastName || ''
                },
                field: { name: r.field?.name || 'Unknown' },
                date: r.date,
                status: r.status
            };
        });

        // 7️⃣ Send all data
        res.json({
            earnings,
            totalBookings,
            latestReservations,
            fields
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
