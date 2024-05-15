const express = require('express');
const path = require('path')
const { createPool } = require('../../database/database');

const router = express.Router()
const db = createPool();

router.get('/', (req, res) => {
  res.sendFile(path.resolve('public/home.html'));
  //res.render('home.html');
});

module.exports = router;