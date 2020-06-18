const express = require('express');
const routerUsers = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const usersCtrl = require('../controllers/users');

/*accueil*/
routerUsers.get('/', forwardAuthenticated, usersCtrl.accueil);

/*recovery*/
routerUsers.post('/recovery', usersCtrl.recoveryP);
routerUsers.get('/recovery', usersCtrl.recoveryG);

/*gestion utilisateur*/
routerUsers.get('/users/login', forwardAuthenticated, usersCtrl.loginG);
routerUsers.post('/users/login', forwardAuthenticated, usersCtrl.loginP);
routerUsers.get('/users/logout', forwardAuthenticated, usersCtrl.logout);

/*inscription*/
routerUsers.get('/users/register', forwardAuthenticated, usersCtrl.registerG);
routerUsers.post('/users/register', forwardAuthenticated, usersCtrl.registerP);

/*site connecté*/
routerUsers.get('/dashboard', ensureAuthenticated, usersCtrl.dashboard);

module.exports = routerUsers;