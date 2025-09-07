/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const { Sequelize } = require('sequelize');
const env = require('./env');

// Create Sequelize instance
const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  dialect: env.db.dialect,
  timezone: env.db.timezone,
  logging: false, // Disable SQL logging
});

// Export sequelize and models placeholder
module.exports = { sequelize };
