const express = require('express');
const user = require('./routes/user/user');
const editPortfolio = require('./routes/portfolio/editPortfolio');
const team = require('./routes/team/team');
const path = require('path');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.post('/userProfile', user.postUserProfile);
app.post('/login', user.login);

app.get('/team', team.team);
app.post('/createLeague', team.createLeague);
app.get('/getLeague', team.getLeague);

app.get('/home', user.home);
app.get('/getHome', user.getHome);

app.get('/stockPool', editPortfolio.stockPool);
app.get('/getStockPool', editPortfolio.getStockPool);
app.post('/addStock', editPortfolio.addStock);
app.get('/getCurrentPortfolio', editPortfolio.getCurrentPortfolio)

// Static file serving
app.get('/client.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'client.js'));
});

app.get('/home.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'home.js'));
});

app.get('/stockPool.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'stockPool.js'));
});

app.get('/team.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'team.js'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
