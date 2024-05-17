const user = require('./routes/user/user');

const express = require('express');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.post('/userProfile', user.postUserProfile);

app.get('/home', user.getHome);

app.get('/getTeam', user.getTeam)


app.get('/client.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/client.js');
});

app.get('/home.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/home.js');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});