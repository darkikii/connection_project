const nodemailer = require('nodemailer');
const mailGun= require('nodemailer-mailgun-transport');


const auth = {
	auth: { /* api_key et domain sont nécessaires pour faire fonctionner l'appli. On les obtient en s'inscrivant sur le site de MailGun */
		api_key: 'key-d6f21363a7c9c4ce6d5397dd9df25a77',
		domain: 'sandbox58c6d94777404f2fbe8e9e53d8c2da11.mailgun.org'
	}
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (email, randPass, callback) => { //Cette fonction sendMail est appelée dans ./users.js
	const mailOptions = {
			from: 'Excited User <me@samples.mailgun.org>',
			to: email,
			subject: 'Récupération de votre mot de passe.', 
			text: 'Votre nouveau mot de passe est :' + randPass
		};
		
	transporter.sendMail(mailOptions, function(err, data) {
		if(err) {
			callback(err, null);
		} else {
			callback(null, data);
		}
	});
};//EO sendMail function



module.exports = sendMail;