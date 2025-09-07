/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const env = require('../config/env');

// Temporary in-memory users (replace with DB later)
const users = [];

// POST /signup
async function signup(req, res, next) {
  try {
    const { email, username, password } = req.body;

    const existing = users.find(u => u.email === email);
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, email, username, password: hashedPassword };
    users.push(newUser);

    return res.status(201).json({ user: { id: newUser.id, email, username } });
  } catch (err) {
    next(err);
  }
}

// POST /login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, { expiresIn: '1h' });

    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
}

// GET /me
function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = { signup, login, me };
