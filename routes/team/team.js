const express = require('express');
const { createPool } = require('../../database/database');

const router = express.Router();
const db = createPool();
var path = require('path');

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

async function team(req, res){
    const filePath = path.resolve('public/team.html');
      
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving team' });
      }
    })
  }

async function createLeague(req, res){
    const { leagueName, username } = req.body;

    query = `INSERT INTO portfolio_info (user_id, portfolio_name)
            SELECT  ui.id, ?
            FROM user_info ui
            WHERE ui.username = ?;`

    try {
        const results = await db.query(query, [leagueName, username]);
        res.json({ success: true, message: 'League created successfully' });
        } 
    catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ success: false, message: 'Database error' });
        }
}

async function getLeague(req, res){
    const { username } = req.query;

    query = `SELECT 
                portfolio_name 
                FROM portfolio_info pi
                JOIN user_info ui ON pi.user_id = ui.id 
                WHERE ui.username = ?;`
    
    try {
        const results = await db.query(query, [username]);
        const cleanedResults = cleanData(results);
        res.status(200).json(cleanedResults);
        } 
    catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ success: false, message: 'Database error' });
        }
}

module.exports = {
    team: team,
    createLeague: createLeague,
    getLeague: getLeague
  }