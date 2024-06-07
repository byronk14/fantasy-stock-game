const express = require('express');
const { createPool } = require('../../database/database');

const router = express.Router();
const db = createPool();
var path = require('path');

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

module.exports = {
    team: team,
    createLeague: createLeague 
  }