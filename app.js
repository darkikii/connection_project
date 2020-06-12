const express = require('express');
var app = require('express')();
const path = require('path');
const bodyParser = require('body-parser');


/*bdd*/
require('./db/db');

/*gestion fichier public et views*/
app.use('/public', express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*pour le CORES*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');/*donne l'acces a tout le monde (*)*/
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/*pour requete post*/
app.use(bodyParser.urlencoded({ extended: true }));

/*gestion des routes*/
const usersRoutes = require('./routers/users');
app.use('/', usersRoutes);/*a changer des que fini*/

module.exports = app; /*exporte notre appli*/