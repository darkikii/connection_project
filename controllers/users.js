var path = require('path');

const Users = require('../models/Users');

exports.accueil = (req, res, next) => {
    res.send('page d\'accueil');
};