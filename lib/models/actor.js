const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  pob: String
});

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
