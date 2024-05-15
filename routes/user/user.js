const express = require('express');
const { createPool } = require('../../database/database');

const router = express.Router();
const db = createPool();

var path = require('path');

router.post('/userProfile', postUserProfile);

async function postUserProfile(req, res) {
    
  const { username, email } = req.body;

  const results = await db.query(`INSERT INTO user_info (username, email) VALUES (?, ?)`, [username, email])
  .then((results) => {
    console.log(results);

    res.redirect('/home'); 
  
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ message: 'Error updating user profile' });
  });
}

router.get('/home', (req, res) => {
  res.sendFile(path.resolve('public/home.html'));
});

module.exports = router;