require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const app = express();
const { PORT = 3000 } = process.env;
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const validations = require('./middlewares/validations');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');

mongoose.connect('mongodb://localhost:27017/moviesdb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.post('/signup', validations.signupValidate, createUser);
app.post('/signin', validations.signinValidate, login);
app.use(auth);
app.use('/movies', require('./routes/movies'));
app.use('/users', require('./routes/users'));

app.use(errorLogger);
app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('Не могу найти!'));
});

app.use((err, req, res, next) => {
  console.log(err.stack || err);
  const status = err.statusCode || 500;
  res.status(status).send({ message: err.message, err });
  next();
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
