const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const validations = require('../middlewares/validations');

router.post('/signup', validations.signupValidate, createUser);
router.post('/signin', validations.signinValidate, login);
module.exports = router;
