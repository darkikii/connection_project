const express = require('express');
const routerUsers = express.Router();
const usersCtrl = require('../controllers/users');

routerUsers.get('/', usersCtrl.accueil);
routerUsers.post('/recovery', usersCtrl.recoveryP);
routerUsers.get('/recovery', usersCtrl.recoveryG);

module.exports = routerUsers;