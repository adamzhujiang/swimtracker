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

// GET /practicesession/:practiceSessionId/edit
router.get('/:practiceSessionId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).send('User not found');

    const session = user.practice_sessions.id(req.params.practiceSessionId);
    if (!session) return res.status(404).send('Practice session not found');

    res.render('practicesession/edit', {
      user,
      session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading edit form');
  }
});

// PUT /practicesession/:practiceSessionId
router.put('/:practiceSessionId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).send('User not found');

    const session = user.practice_sessions.id(req.params.practiceSessionId);
    if (!session) return res.status(404).send('Practice session not found');

    session.date = req.body.date;
    session.laps = req.body.laps;
    session.stroke_type = req.body.stroke_type;
    session.durationMinutes = req.body.durationMinutes;
    session.notes = req.body.notes;

    await user.save();

    res.redirect(`/practicesession/${session._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating practice session');
  }
});

router.get('/:practiceSessionId', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const session = user.practice_sessions.id(req.params.practiceSessionId);

  if (!session) {
    return res.status(404).send('Practice session not found');
  }

  res.render('practicesession/show', {
    user,
    session,
  });
});

router.delete('/:practiceSessionId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).send('User not found');

    user.practice_sessions = user.practice_sessions.filter(session => session._id.toString() !== req.params.practiceSessionId);

    await user.save();

    res.redirect('/practicesession');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while deleting practice session');
  }
});

module.exports = router;