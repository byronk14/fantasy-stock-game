const express = require('express');
const user = require('./routes/user/user');
const editPortfolio = require('./routes/portfolio/editPortfolio');
const path = require('path');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.post('/userProfile', user.postUserProfile);
app.get('/home', user.getHome);
app.get('/getTeam', user.getTeam);
app.get('/stockPool', editPortfolio.stockPool);
app.get('/getStockPool', editPortfolio.getStockPool);
app.post('/addStock', editPortfolio.addStock);

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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
