const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.likePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  try {
    await pool.query(
      'INSERT INTO likes(id,user_id,post_id,created_at) VALUES($1,$2,$3,NOW()) ON CONFLICT DO NOTHING',
      [uuidv4(), userId, postId]
    );
    res.json({ message: 'Post liked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unlikePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  try {
    await pool.query('DELETE FROM likes WHERE user_id=$1 AND post_id=$2', [userId, postId]);
    res.json({ message: 'Post unliked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.commentPost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text is required' });
  try {
    const result = await pool.query(
      'INSERT INTO comments(id,user_id,post_id,text,created_at) VALUES($1,$2,$3,$4,NOW()) RETURNING *',
      [uuidv4(), userId, postId, text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getComments = async (req, res) => {
  const postId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT c.*, u.username FROM comments c JOIN users u ON u.id=c.user_id WHERE c.post_id=$1 ORDER BY c.created_at DESC`,
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sharePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  try {
    await pool.query('INSERT INTO shares(id,user_id,post_id,created_at) VALUES($1,$2,$3,NOW())', [uuidv4(), userId, postId]);
    res.json({ message: 'Post shared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
