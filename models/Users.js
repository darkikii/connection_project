const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  formerPassword: { type: String, required: false}
});

module.exports = mongoose.model('Users', usersSchema);