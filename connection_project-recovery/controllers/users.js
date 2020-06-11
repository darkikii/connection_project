var path = require('path');
const randomPassword = require ('generate-password');
const bcrypt = require('bcrypt');
const Users = require('../models/Users');

exports.accueil = (req, res, next) => {
    res.send('page d\'accueil');
};

exports.recoveryP = (req, res, next) => {
	
	if(req.body.name){
		Users.findOne({ name: req.body.name })
		.then(result => {
			if(result){console.log(result);

				(async () => { 
				try {

					/* Génération du nouveau pass + hashage */

					let password = randomPassword.generate({
				    length: 10,
				    numbers: true
					});

					let salt = await bcrypt.genSalt(10);
					var hash = await bcrypt.hash(password, salt);
					console.log(hash);

					/* Update des passwords */

					Users.updateOne({ name: req.body.name}, 
						{ $set: {
							password : hash,
							formerPassword: result.password
						}})
						.then( function(){res.redirect('/');})
				
					} 

					catch(error) {
						console.log("Erreur dans update password");
					}
				})()

				

				
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