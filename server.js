const mongoose = require('mongoose');
const app = require('./app');

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