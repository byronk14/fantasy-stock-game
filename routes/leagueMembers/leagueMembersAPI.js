const express = require('express');
const { createPool } = require('../../database/database');

const router = express.Router();
const db = createPool();
var path = require('path');

async function leagueMembers(req, res){
    const filePath = path.resolve('public/leagueMembers.html');
      
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving team' });
      }
    })
  }


  module.exports = {
    leagueMembers: leagueMembers,
  }