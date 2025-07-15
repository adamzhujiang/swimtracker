const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /practicesession/new
router.get('/new', (req, res) => {
  res.render('practicesession/new', { user: req.session.user });
});

// GET /practicesession
router.get('/', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  res.render('practicesession/index', {
    user,
    practiceSessions: user.practice_sessions,
  });
});

// POST /practicesession
router.post('/', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) {
    return res.status(404).send('User not found');
  }

  const newSession = {
    date: req.body.date,
    laps: req.body.laps,
    stroke_type: req.body.stroke_type,
    durationMinutes: req.body.durationMinutes,
    notes: req.body.notes,
  };

  user.practice_sessions.push(newSession);
  await user.save();
  res.render('practicesession/success', { user });
});

module.exports = router;