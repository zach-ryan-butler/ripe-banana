const mongoose = require('mongoose')

const filmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: mongoose.Types.ObjectId,
    ref: 'Studio',
    required: true
  },
  released: {
    type: Number,
    required: true
  },
  cast: [{
    role: String,
    actor: {
      type: mongoose.Types.ObjectId,
      ref: 'Actor',
      required: true
    }
  }]
});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;