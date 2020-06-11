var path = require('path');

const Users = require('../models/Users');

exports.accueil = (req, res, next) => {
    res.send('page d\'accueil');
};

exports.recoveryP = (req, res, next) => {
	
	if(req.body.name){
		Users.findOne({ name: req.body.name })
		.then(result => {
			if(result){console.log(result);
				res.status(200).send(result);
			} else {
				res.status(404).send( "Ce compte utilisateur n'exite pas" );
			}
		})
		.catch(error => res.status(404).send({ error }));
	}
	else if(req.body.email){
		Users.findOne({ email: req.body.email })
		.then(result => {
			if(result){console.log(result);
				res.status(200).send(result);
			} else {
				res.status(404).send( "Ce compte mail n'exite pas" );
			}
		})
		.catch(error => res.status(404).send({ error }));
	}
	
};

exports.recoveryG = (req, res, next) => {
    res.render('recovery');
};