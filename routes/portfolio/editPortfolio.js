const express = require('express');
const { createPool } = require('../../database/database');

const db = createPool();

async function getStockPool(req, res) {

  const { username } = req.query;

  try {
    const results = await db.query(
      `SELECT 
        pld.stock_symbol,
        pld.stock_name,
        lsq.ask_price ,
        lsq.bid_price ,
        lsq.timestamp AS stock_timestamp 
      FROM portfolio_info pi
      JOIN user_info ui on pi.user_id = ui.id 
      JOIN portfolio_lineup_details pld on pld.portfolio_id  = pi.portfolio_id 
      JOIN latest_stock_quotes lsq on lsq.symbol = pld.stock_symbol 
      WHERE ui.username = ?`, [username]);

    console.log(results)
    
    res.json(results);
  }
  
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving stock pool' });
    }
  }

  module.exports = {
    getStockPool: getStockPool
  }