const express = require('express');

const router = express.Router()

router.post('/userProfile', postUserProfile);

function postUserProfile(req, res) {
    // Your logic to retrieve the user data goes here
    // For example, fetching from a database or an API
    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com'
    };
  
    res.json(userData);
  }

module.exports = router;