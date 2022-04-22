const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      if (movies) {
        res.status(200).send(movies);
      } else {
        throw new NotFoundError('Фильмы не найдены');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найдена');
      } else if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Это не ваш фильм');
      } else {
        return Movie.deleteOne({
          _id: movie._id,
        });
      }
    })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    movieId,
    nameRU,
    nameEN,
    director,
    country,
    year,
    duration,
    description,
    trailerLink,
    image,
    thumbnail,
  } = req.body;
  Movie.create({
    movieId,
    nameRU,
    nameEN,
    director,
    country,
    year,
    duration,
    description,
    trailerLink,
    image,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
