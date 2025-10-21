const cron = require('node-cron');
const User = require('../models/userModel');

// Run once every day at midnight
cron.schedule('0 0 * * *', async () => {
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(Date.now() - THIRTY_DAYS);

  try {
    const deleted = await User.deleteMany({
      active: false,
      deletedAt: { $lte: cutoffDate }
    });

    console.log(`🧹 Deleted ${deleted.deletedCount} inactive users`);
  } catch (err) {
    console.error('Error deleting old users:', err);
  }
});
