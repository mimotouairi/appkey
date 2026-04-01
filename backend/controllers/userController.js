const pool = require('../db');

exports.getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, username, email, bio, created_at FROM users WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.followUser = async (req, res) => {
  const userId = req.user.id;
  const followingId = req.params.id;
  if (userId === followingId) return res.status(400).json({ message: 'Cannot follow yourself' });
  try {
    await pool.query(
      'INSERT INTO follows(id, follower_id, following_id, created_at) VALUES($1,$2,$3,NOW()) ON CONFLICT DO NOTHING',
      [require('uuid').v4(), userId, followingId]
    );
    res.json({ message: 'Followed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unfollowUser = async (req, res) => {
  const userId = req.user.id;
  const followingId = req.params.id;
  try {
    await pool.query('DELETE FROM follows WHERE follower_id=$1 AND following_id=$2', [userId, followingId]);
    res.json({ message: 'Unfollowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFollowList = async (req, res) => {
  const { id } = req.params;
  try {
    const followers = await pool.query(
      `SELECT u.id, u.username FROM follows f JOIN users u ON u.id=f.follower_id WHERE f.following_id=$1`,
      [id]
    );
    const following = await pool.query(
      `SELECT u.id, u.username FROM follows f JOIN users u ON u.id=f.following_id WHERE f.follower_id=$1`,
      [id]
    );
    res.json({ followers: followers.rows, following: following.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
