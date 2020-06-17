const express = require('express');
const expressLayouts = require('express-ejs-layouts');
var app = require('express')();
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

// Config Passport 
require('./config/passport')(passport);

/*bdd*/
require('./db/db');

/*gestion fichier public et views*/
app.use('/public', express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

/*pour le CORES*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');/*donne l'acces a tout le monde (*)*/
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

/*pour requete post*/
app.use(bodyParser.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

/*gestion des routes*/
const usersRoutes = require('./routers/users');
app.use('/', usersRoutes);/*a changer des que fini*/
app.use('/users', usersRoutes);

module.exports = app; /*exporte notre appli*/