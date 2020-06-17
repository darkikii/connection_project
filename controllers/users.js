var path = require('path');
const randomPassword = require ('generate-password');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Users = require('../models/Users');
const sendMail = require('./recoveryMail');

exports.accueil = (req, res, next) => {
    res.render('home', {recoveryValidation :""});
};

/*********************************************************************************************************************
******************************************* RECOVERY *****************************************************************
*********************************************************************************************************************/

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

/*********************************************************************************************************************
******************************************* GESTION UTILISATEUR ******************************************************
*********************************************************************************************************************/

exports.registerG = (req, res, next) => {
	res.render('register');
};

exports.registerP = (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Veuillez remplir tous les champs' });
  }

  if (password != password2) {
    errors.push({ msg: 'Mots de passe différents' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Mot de passe de 6 caractères minimus' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    Users.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email déjà existant' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new Users({
          name,
          email,
          password
        });/*fin de newUser*/

        /* hashage */
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Vous êtes maintenant enregistré et pouvez vous connecter'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });/*fin de bcrypt*/
        });/*fin de hashage*/
      }/*fin de if else de findOne*/
    });/*fin de findOne*/
  }/*fin de if else verif error*/
};

exports.loginG = (req, res, next) => {
	res.render('login');
};

exports.loginP = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'Deconnexion réussie');
  res.redirect('/users/login');
};

exports.dashboard = (req, res, next) => {
	res.render('dashboard', {
    user: req.user
  })
};