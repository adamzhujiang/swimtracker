const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /users/:userId/practicesession/new
router.get('/new', (req, res) => {
  res.render('practicesession/new', { user: req.session.user });
});

// GET /users/:userId/practicesession
router.get('/', async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.render('practicesession/index', {
    user,
    practiceSessions: user.practice_sessions,
  });
});

// POST /users/:userId/practicesession
router.post('/', async (req, res) => {
  const user = await User.findById(req.params.userId);
  const newSession = {
    date: req.body.date,
    laps: req.body.laps,
    stroke_type: req.body.stroke_type,
    durationMinutes: req.body.durationMinutes,
    notes: req.body.notes,
  };
  user.practice_sessions.push(newSession);
  await user.save();
  res.redirect(`/users/${user._id}/practicesession`);
});

module.exports = router;