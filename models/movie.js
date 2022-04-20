const mongoose = require('mongoose');

const regex = /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/i;
const regexRU = /[а-я\sё]/i;

function validator(value) {
  return regex.test(value);
}

function langValidator(value) {
  return regexRU.test(value);
}

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    validate: validator,
  },
});

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: imageSchema,
  trailerLink: {
    type: String,
    required: true,
    validate: validator,
  },
  thumbnail: {
    type: String,
    required: true,
    validate: validator,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    validate: langValidator,
  },
  nameEN: {
    type: String,
    required: true,
    validate: langValidator,
  },
});

module.exports = mongoose.model('movie', movieSchema);
