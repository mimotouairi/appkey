const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const createToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE || '7d',
  });
};

exports.register = async (req, res) => {
  const { username, email, password, bio } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email, password are required' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const existing = await pool.query('SELECT id FROM users WHERE email=$1 OR username=$2', [email, username]);
    if (existing.rows.length) {
      return res.status(409).json({ message: 'Email or username already exists' });
    }
    const userId = uuidv4();
    const result = await pool.query(
      'INSERT INTO users(id, username, email, password_hash, bio) VALUES($1,$2,$3,$4,$5) RETURNING id, username, email, bio, created_at',
      [userId, username, email, hashed, bio || '']
    );
    const user = result.rows[0];
    const token = createToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body; 
  if (!identifier || !password) return res.status(400).json({ message: 'Identifier and password are required' });
  
  try {
    const result = await pool.query(
      'SELECT id, username, email, password_hash, bio FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)', 
      [identifier]
    );

    if (!result.rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(user);
    delete user.password_hash;
    res.json({ user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
