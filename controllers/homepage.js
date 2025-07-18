// controllers/applications.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// router logic

router.get('/', async (req, res) => {
  try {
    res.render('homepage/index.ejs');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


module.exports = router;
