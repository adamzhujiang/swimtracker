const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/sign-up', async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render('auth/sign-up', { error: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render('auth/sign-up', { error: 'Username or email already taken' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Store minimal user info in session
    req.session.user = {
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
    };

    res.redirect(`/users/${newUser._id}/homepage`);
  } catch (error) {
    console.error(error);
    res.render('auth/sign-up', { error: 'Something went wrong. Please try again.' });
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.render('auth/sign-in', { error: 'User not found' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.render('auth/sign-in', { error: 'Incorrect password' });
    }

    req.session.user = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    };

    res.redirect(`/users/${user._id}/homepage`);
  } catch (error) {
    console.error(error);
    res.render('auth/sign-in', { error: 'Something went wrong. Please try again.' });
  }
});


router.get('/sign-out', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Error destroying session:', err);
    }
    res.redirect('/auth/sign-in');
  });
});

module.exports = router;
