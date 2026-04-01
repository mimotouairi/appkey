const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.createPost = async (req, res) => {
  const userId = req.user.id;
  const { caption, media_url, type } = req.body;
  if (!media_url || !type) return res.status(400).json({ message: 'Missing media_url or type' });
  try {
    const result = await pool.query(
      'INSERT INTO posts(id, user_id, caption, media_url, type, created_at) VALUES($1,$2,$3,$4,$5,NOW()) RETURNING *',
      [uuidv4(), userId, caption || '', media_url, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM posts WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFeed = async (req, res) => {
  const userId = req.user.id;
  try {
    const following = await pool.query('SELECT following_id FROM follows WHERE follower_id=$1', [userId]);
    const ids = following.rows.map((r) => r.following_id);
    const resize = ids.length ? ids : [userId];
    const posts = await pool.query(
      `SELECT p.*, u.username, u.bio FROM posts p JOIN users u ON u.id=p.user_id WHERE p.user_id=ANY($1::uuid[]) ORDER BY p.created_at DESC LIMIT 40`,
      [resize]
    );
    res.json(posts.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.explore = async (req, res) => {
  try {
    const posts = await pool.query(
      `SELECT p.*, u.username, u.bio,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id=p.id) AS likes,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id=p.id) AS comments,
        (SELECT COUNT(*) FROM shares s WHERE s.post_id=p.id) AS shares
       FROM posts p JOIN users u ON u.id=p.user_id
       ORDER BY p.created_at DESC
       LIMIT 50`
    );
    res.json(posts.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
