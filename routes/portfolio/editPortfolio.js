const express = require('express');
const { createPool } = require('../../database/database');
const Alpaca = require('@alpacahq/alpaca-trade-api');

const db = createPool();

const alpaca = new Alpaca({
  keyId: 'PK1UTT98NNORRAX6YYLM',
  secretKey: 'EpgKTW3YeeoJ4xcJsXwes9L0xADOdn5fjG7m7mgR',
  paper: true,
})

async function getStockPool(req, res) {
    
    const trades = await alpaca.getLatestQuotes(["PFE", "SPY", "MSFT"]);
    console.log(trades);

    // const results = await db.query()
    // .then((results) => {
    res.json(trades);
    // })
    // .catch((err) => {
    //   console.error(err);
    //   res.status(500).json({ message: 'Error retrieving stock pool' });
    // });
  }

  module.exports = {
    getStockPool: getStockPool
  }