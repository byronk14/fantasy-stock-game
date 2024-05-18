const express = require('express');
const user = require('./routes/user/user');
const path = require('path');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.post('/userProfile', user.postUserProfile);
app.get('/home', user.getHome);
app.get('/getTeam', user.getTeam);

// Static file serving
app.get('/client.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'client.js'));
});

app.get('/home.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'home.js'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
