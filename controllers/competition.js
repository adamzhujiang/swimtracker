const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /users/:userId/competitions
router.get('/', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).send('User not found');
  res.render('competition/index', {
    user,
    competitions: user.competitions,
  });
});

// GET /users/:userId/competitions/new
router.get('/new', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).send('User not found');
  res.render('competition/new', { user });
});

// POST /users/:userId/competitions
router.post('/', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).send('User not found');

  user.competitions.push({
    eventName: req.body.eventName,
    stroke_type: req.body.stroke_type,
    distance: req.body.distance,
    time: req.body.time,
    meetName: req.body.meetName,
    date: req.body.date,
  });

  await user.save();
  res.render('competition/success', { user });
});

// GET /users/:userId/competitions/:competitionId
router.get('/:competitionId', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).send('User not found');

  const competition = user.competitions.id(req.params.competitionId);
  if (!competition) return res.status(404).send('Competition entry not found');

  res.render('competition/show', { user, competition });
});

// GET /users/:userId/competitions/:competitionId/edit
router.get('/:competitionId/edit', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).send('User not found');

  const competition = user.competitions.id(req.params.competitionId);
  if (!competition) return res.status(404).send('Competition entry not found');

  res.render('competition/edit', { user, competition });
});

// PUT /users/:userId/competitions/:competitionId
router.put('/:competitionId', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).send('User not found');

  const competition = user.competitions.id(req.params.competitionId);
  if (!competition) return res.status(404).send('Competition entry not found');

  competition.eventName = req.body.eventName;
  competition.stroke_type = req.body.stroke_type;
  competition.distance = req.body.distance;
  competition.time = req.body.time;
  competition.meetName = req.body.meetName;
  competition.date = req.body.date;

  await user.save();
  res.redirect(`/users/${user._id}/competitions/${competition._id}`);
});

// DELETE /users/:userId/competitions/:competitionId
router.delete('/:competitionId', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user) return res.status(404).send('User not found');

  user.competitions = user.competitions.filter(comp => comp._id.toString() !== req.params.competitionId);
  await user.save();

  res.redirect(`/users/${user._id}/competitions`);
});

module.exports = router;