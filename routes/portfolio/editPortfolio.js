const express = require('express');
const { createPool } = require('../../database/database');
const path = require('path');

const db = createPool();

const cleanData = (data) => {
  return data.map(innerArray => 
    innerArray.map(stock => {
      // Destructure to exclude unwanted properties
      const {
        _buf, _clientEncoding, _catalogLength, _catalogStart, _schemaLength, _schemaStart,
        _tableLength, _tableStart, _orgTableLength, _orgTableStart, _orgNameLength, _orgNameStart,
        characterSet, encoding, name, columnLength, columnType, type, flags, decimals, ...cleanStock
      } = stock;
      return cleanStock;
    }).filter(stock => Object.keys(stock).length > 0) // Filter out empty objects
  ).filter(innerArray => innerArray.length > 0); // Filter out empty inner arrays
};

async function stockPool(req, res) {
  const filePath = path.resolve('public/stockPool.html');
    
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving stock pool' });
    }
  })
}

async function getStockPool(req, res) {
  try {
    const results = await db.query('SELECT * FROM latest_stock_quotes');
    const cleanedResults = cleanData(results);
    res.json(cleanedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving stock pool' });
  }
};

async function addStock(req, res) {
    const { stock_symbol, stock_close, stock_high, stock_low, stock_open, stock_timestamp, stock_trade_count, stock_volume, stock_vwap, username } = req.body;

    query = `INSERT INTO portfolio_lineup_details (portfolio_id, stock_symbol, stock_close, stock_high, stock_low, stock_open, stock_timestamp, stock_trade_count, stock_volume, stock_vwap)
    SELECT p.portfolio_id, ?, ?, ?, ?, ?, ?, ?, ?, ?
    FROM user_info u
    JOIN portfolio_info p ON u.id = p.user_id
    WHERE u.username = ?;
     `

    const values = [
      stock_symbol,
      stock_close,
      stock_high,
      stock_low,
      stock_open,
      new Date(stock_timestamp).toISOString().slice(0, 19).replace('T', ' '),
      stock_trade_count,
      stock_volume,
      stock_vwap,
      username
    ];

  try {
      const result = await db.query(query, values);
      res.json({ success: true, message: 'Stock added successfully' });
      } 
  catch (error) {
      console.error('Error executing query', error.stack);
      res.status(500).json({ success: false, message: 'Database error' });
      }
}
  

module.exports = {
  stockPool: stockPool,
  getStockPool: getStockPool,
  addStock: addStock
}