const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const validations = require('../middlewares/validations');

router.get('/', getMovies);
router.post('/', validations.movieValidate, createMovie);
router.delete('/:_id', validations.movieIdValidate, deleteMovie);
module.exports = router;
