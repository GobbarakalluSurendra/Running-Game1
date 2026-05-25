const express = require('express');
const router = express.Router();
const { saveScore, getLeaderboard, checkUsername } = require('../controllers/scoreController');

router.route('/').post(saveScore);
router.route('/check/:username').get(checkUsername);
router.route('/leaderboard').get(getLeaderboard);

module.exports = router;
