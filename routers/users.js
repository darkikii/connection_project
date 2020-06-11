const express = require('express');
const routerUsers = express.Router();
const usersCtrl = require('../controllers/users');

routerUsers.get('/', usersCtrl.accueil);

module.exports = routerUsers;