const cron = require('node-cron');
const User = require('../models/userModel');
const Reservation = require('../models/reservationModel');
const FootballField = require('../models/footballFieldModel');

// Run once every day at midnight
cron.schedule('0 0 * * *', async () => {
  const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  try {
    const usersToDelete = await User.find({
      active: false,
      deletedAt: { $lte: threshold },
      permanentlyDeleted: false
    });

    for (const user of usersToDelete) {
      if (user.role === 'player') {
        await Reservation.deleteMany({ player: user._id });
      }

      if (user.role === 'owner') {
        const fields = await FootballField.find({ owner: user._id });
        const fieldIds = fields.map((f) => f._id);
        await FootballField.deleteMany({ _id: { $in: fieldIds } });
        await Reservation.deleteMany({ field: { $in: fieldIds } });
      }

      user.permanentlyDeleted = true;
      await user.save();
      await User.findByIdAndDelete(user._id);
    }

    console.log(`🧹 Auto-deleted ${usersToDelete.length} users`);
  } catch (err) {
    console.error('Error deleting old users:', err);
  }
});
