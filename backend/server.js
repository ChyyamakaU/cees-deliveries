/* eslint-disable no-undef */
require('dotenv').config();

const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('Database connection established.');

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Cee's Deliveries API listening on http://localhost:${PORT}/api`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to start the server:', error.message);
    process.exit(1);
  }
}

start();

module.exports = app;
