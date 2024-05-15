const mysql = require('mysql2/promise');

function createPool() {
  const db = mysql.createPool({
    host: 'localhost',
    user: 'sysuser',
    password: 'sysuser',
    database: 'fantasy_game_store'
  });

  return db
}

module.exports = { createPool };