const mongoose = require('mongoose');

mongoose.connect('',
	{
	    useNewUrlParser: true,
	    useCreateIndex: true,
	    useUnifiedTopology: true
	})
	.then(() => console.log('Connexion à MongoDB réussie !'))
  	.catch((error) => console.log(error));
