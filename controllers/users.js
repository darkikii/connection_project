var path = require('path');
const randomPassword = require ('generate-password');
const bcrypt = require('bcrypt');
const Users = require('../models/Users');
const sendMail = require('./recoveryMail');

exports.accueil = (req, res, next) => {
    res.render('home', {recoveryValidation :""});
};

exports.recoveryP = (req, res, next) => {
	
	if(req.body.name){		/* si on recover son mdp via le nom d'utilisateur */
		Users.findOne({ name: req.body.name })
		.then(result => {
			if(result){console.log(result);

				(async () => { 
					try {

						console.log("on est dans le name");

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
						.then()
						
						/* Envoi de l'email*/	

						let email = result.email;

						console.log(email);

						sendMail(email, hash, function(err, data){
							if(err){
									console.log('Erreur lors de l\'envoi du mail...')
									console.log(err);
									res.render('recovery', {errorMessage: "Votre réinitialisation de mot-de-passe n'a pas pu être mené à son terme suite à un dysfonctionnement interne. "});
							}else{
								console.log('Message envoyé');
								res.render('home', {recoveryValidation: "Réinitialisation du mot-de-passe effectuée ! Veuillez consulter votre boite mail."});
							}
						});//EO sendMail call
					}//EO try

					catch(error) {
						console.log("Erreur dans update password");
					}
				})()//EO async

			} else {
				res.render('recovery', {errorMessage: "Cet utilisateur n'existe pas..."});
			}
		})
		.catch(error => res.render('recovery', {errorMessage: "Votre réinitialisation de mot-de-passe n'a pas pu être mené à son terme suite à un dysfonctionnement interne. "}));
	}
	else if(req.body.email){		/* si on recover son mdp via l'email' */
		Users.findOne({ email: req.body.email })
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

						Users.updateOne({ email: req.body.email}, 
							{ $set: {
								password : hash,
								formerPassword: result.password
							}})
							.then()

							/* Envoi de l'email*/

							let email = result.email;

							console.log(email);

							sendMail(email, hash, function(err, data){
								if(err){
										console.log('Erreur lors de l\'envoi du mail...')
										console.log(err);
										res.render('recovery', {errorMessage: "Votre réinitialisation de mot-de-passe n'a pas pu être mener à son terme suite à un dysfonctionnement interne. "});
								}else{
									console.log('Message envoyé');
									res.render('home', {recoveryValidation: "Réinitialisation du mot-de-passe effectuée ! Veuillez consulter votre boite mail."});
								}
							});
						}//EO try

						catch(error) {
							console.log("Erreur dans update password");
						}
				})()//EO async
			} else {
				res.render('recovery', {errorMessage: "Cette adresse email n'est pas associée à l'un de nos compte utilisateur..."});
			}
		})
		.catch(error => res.render('recovery', {errorMessage: "Votre réinitialisation de mot-de-passe n'a pas pu être mener à son terme suite à un dysfonctionnement interne. "}));
	}//EO else if
	
};//EO recoveryP

exports.recoveryG = (req, res, next) => {
    res.render('recovery', {errorMessage: ""});
};