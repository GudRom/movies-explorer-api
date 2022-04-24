const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => {
        const newUser = user.toObject();
        delete newUser.password;
        res.status(200).send(newUser);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Переданы некорректные данные');
        }
        if (err.code === 11000) {
          throw new ConflictError('Пользователь с таким email уже существует');
        }
        return next(err);
      }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ jwt: token });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user && (user.email !== { email })) {
        throw new ConflictError(`Пользователь с таким email ${user.email} уже существует`);
      }
      return User.findByIdAndUpdate(
        req.user._id,
        { email, name },
        { new: true, runValidators: true },
      );
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
