const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const validations = require('../middlewares/validations');

router.get('/movies', getMovies);
router.post('/movies', validations.movieValidate, createMovie);
router.delete('/movies/:_id', validations.movieIdValidate, deleteMovie);
module.exports = router;
