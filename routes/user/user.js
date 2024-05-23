const express = require('express');
const { createPool } = require('../../database/database');

const router = express.Router();
const db = createPool();

var path = require('path');

async function postUserProfile(req, res) {
    
  const { username, email } = req.body;

  const results = await db.query(`INSERT INTO user_info (username, email) VALUES (?, ?)`, [username, email])
  .then((results) => {

    res.redirect('/home');  
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ message: 'Error updating user profile' });
  });
}

async function getHome(req, res){
  res.sendFile(path.resolve('public/home.html'));
}

async function getTeam(req, res){
  const { username } = req.query;

  const results = await db.query(`SELECT
                                  pld.stock_symbol,
                                  pld.stock_close,
                                  pld.stock_high,
                                  pld.stock_low,
                                  pld.stock_open,
                                  pld.stock_timestamp,
                                  pld.stock_trade_count,
                                  pld.stock_volume,
                                  pld.stock_vwap
                                  FROM user_info ui 
                                  JOIN portfolio_info pi2 on ui.id = pi2.user_id 
                                  JOIN portfolio_lineup_details pld on pi2.portfolio_id = pld.portfolio_id  
                                  WHERE ui.username = ?`, [username]);

  const portfolio_name = await db.query(`SELECT 
                                      portfolio_name
                                      FROM portfolio_info pi
                                      JOIN user_info ui on pi.user_id = ui.id 
                                      WHERE ui.username = ?`, [username]);

  //console.log([results, portfolio_name]);
  res.json([results, portfolio_name])
}

module.exports = {
  router: router,
  postUserProfile: postUserProfile,
  getHome: getHome,
  getTeam: getTeam
};