/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");


const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
    // NOTE: مفيش sync جبري هنا عشان ما نلمسش الجداول
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Unable to connect to the database:", err);
    process.exit(1);
  }
})();
