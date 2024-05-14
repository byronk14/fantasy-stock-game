const userRoutes = require('./routes/user');

const express = require('express');

const app = express();

app.use(express.static('public'));

app.use(express.static('./', {
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    }
  }));

app.use('/users', userRoutes);

app.get('/', (req, res) => {

  });

  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });