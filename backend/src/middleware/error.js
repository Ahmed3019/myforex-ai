/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

// Centralized error handler middleware
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    code: err.code || 'SERVER_ERROR',
    details: err.details || null,
  });
}

module.exports = errorHandler;
