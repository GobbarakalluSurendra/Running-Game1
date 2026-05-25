const Score = require('../models/Score');

// @desc    Save new score
// @route   POST /api/scores
// @access  Public
const saveScore = async (req, res) => {
  try {
    const { username, score } = req.body;
    
    if (!username || score === undefined) {
      return res.status(400).json({ message: 'Please provide username and score' });
    }

    // Find if user already exists (case-insensitive)
    const existingScore = await Score.findOne({
      username: { $regex: new RegExp(`^${username.trim()}$`, 'i') }
    });

    if (existingScore) {
      if (score > existingScore.score) {
        existingScore.score = score;
        existingScore.timestamp = new Date();
        existingScore.username = username.trim(); // Update casing to latest preference
        await existingScore.save();
        return res.status(200).json(existingScore);
      }
      return res.status(200).json(existingScore);
    }

    const newScore = await Score.create({
      username: username.trim(),
      score
    });

    res.status(201).json(newScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving score' });
  }
};

// @desc    Check if username exists
// @route   GET /api/scores/check/:username
// @access  Public
const checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ exists: false, message: 'Username is required' });
    }

    const existing = await Score.findOne({
      username: { $regex: new RegExp(`^${username.trim()}$`, 'i') }
    });

    if (existing) {
      return res.status(200).json({ exists: true });
    }

    res.status(200).json({ exists: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error checking username' });
  }
};

// @desc    Get top 10 scores
// @route   GET /api/scores/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const topScores = await Score.find()
      .sort({ score: -1 })
      .limit(10);
      
    res.status(200).json(topScores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching leaderboard' });
  }
};

module.exports = {
  saveScore,
  checkUsername,
  getLeaderboard
};
