/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const http = require('http');
const app = require('./app');
const { sequelize } = require('./config/db');

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Start the server after DB connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync models with DB (auto create/alter tables)
    await sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully.');

    server.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
})();
