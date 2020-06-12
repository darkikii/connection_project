const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://darkikii:Adeline1014++@cluster0-fjhlh.mongodb.net/connection_project?retryWrites=true&w=majority',
	{
	    useNewUrlParser: true,
	    useCreateIndex: true,
	    useUnifiedTopology: true
	})
	.then(() => console.log('Connexion à MongoDB réussie !'))
  	.catch((error) => console.log(error));