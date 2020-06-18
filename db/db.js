const mongoose = require('mongoose');

mongoose.connect(/*addresse ici entre guillemet*/,
	{
	    useNewUrlParser: true,
	    useCreateIndex: true,
	    useUnifiedTopology: true
	})
	.then(() => console.log('Connexion à MongoDB réussie !'))
  	.catch((error) => console.log(error));