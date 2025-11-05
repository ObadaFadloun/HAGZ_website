import cron from 'node-cron';
import Reservation from '../models/reservationModel.js';

export function autoCompleteReservations() {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();
      const activeReservations = await Reservation.find({ status: 'active' });

      for (const res of activeReservations) {
        const endDateTime = new Date(`${res.date}T${res.endTime}`);
        if (endDateTime <= now) {
          res.status = 'completed';
          await res.save();
        }
      }

      console.log('✅ Completed old reservations at:', now.toLocaleString());
    } catch (err) {
      console.error('❌ Auto-complete job failed:', err.message);
    }
  });
}
