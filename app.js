require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const app = express();
const { PORT = 3000 } = process.env;
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');

mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/moviesdb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: ['https://movies.gudrom.nomoredomains.xyz', 'http://movies.gudrom.nomoredomains.xyz', 'http://localhost:3000'],
  credentials: true,
}));
app.use(requestLogger);

app.use(require('./routes/auth'));

app.use(auth);
app.use(require('./routes/movies'));
app.use(require('./routes/users'));

app.use((req, res, next) => {
  next(new NotFoundError('Не могу найти!'));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  console.log(err.stack || err);
  const status = err.statusCode || 500;
  res.status(status).send({ message: err.message });
  next();
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
