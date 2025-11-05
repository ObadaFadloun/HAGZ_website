const mongoose = require('mongoose');
const app = require('./app');

(async () => {
  const { autoCompleteReservations } = await import("./utils/autoCompleteReservations.mjs");
  autoCompleteReservations();
})();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const uri = process.env.URI;
const password = process.env.PASSWORD;

(async () => {
  try {
    const connectionString = uri.replace('<PASSWORD>', password);
    await mongoose.connect(connectionString);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

mongoose.connection.on('connected', () => {
  app.listen(3000, async (err) => {
    if (err) {
      console.error(err);
      await mongoose.disconnect();
      process.exit(1);
    }
    console.log('Listening on port 3000');
  });
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

require('./cronJobs/deleteOldUsers');
