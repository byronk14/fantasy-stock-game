const userRoutes = require('./routes/user/user');

const express = require('express');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use('/', userRoutes);


app.get('/client.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/client.js');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});