/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

require('dotenv').config();

const env = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
  db: {
    host: process.env.DB_HOST || 'localhost',
    name: process.env.DB_NAME || 'forex_db',
    user: process.env.DB_USER || 'forex_user',
    pass: process.env.DB_PASS || 'password',
    dialect: 'postgres',
    timezone: process.env.TZ || 'UTC',
  },
};

module.exports = env;
