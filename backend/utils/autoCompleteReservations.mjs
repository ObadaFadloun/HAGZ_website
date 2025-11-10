import cron from 'node-cron';
import Reservation from '../models/reservationModel.js';

export function autoCompleteReservations() {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();
      const activeReservations = await Reservation.find({ status: 'active' });

      for (const res of activeReservations) {
        // --- Normalize the date to YYYY-MM-DD ---
        let dateISO;
        if (res.date instanceof Date) {
          // If it's a Date object, convert to ISO and take the date part
          dateISO = res.date.toISOString().split('T')[0];
        } else {
          // Otherwise coerce to string and attempt to split (covers strings like "2025-11-06T00:00:00.000Z")
          dateISO = String(res.date).split('T')[0];
        }

        // --- Normalize endTime (accept "HH:MM" or "HH:MM:SS") ---
        const timeParts = String(res.endTime || '00:00').split(':');
        const hour = parseInt(timeParts[0] || '0', 10);
        const minute = parseInt(timeParts[1] || '0', 10);
        const second = parseInt(timeParts[2] || '0', 10);

        // --- Build Date safely ---
        // OPTION A (assumes the time is in UTC): use "Z"
        // const endDateTime = new Date(`${dateISO}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}Z`);

        // OPTION B (assumes the time is local, constructs with Date(year, month-1, day, hour, minute, second))
        const [year, month, day] = dateISO.split('-').map(Number);
        const endDateTime = new Date(
          year,
          month - 1,
          day,
          hour,
          minute,
          second
        );

        // compare and update
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
