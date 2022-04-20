const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

const signupValidate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().custom((value, helper) => {
      if (!validator.isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }),
    password: Joi.string().required().messages({
      'any.required': 'Пароль не указан',
      'string.min': 'Короткий пароль',
    }),
    name: Joi.string().min(2).max(30),
  }),
});

const signinValidate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().custom((value, helper) => {
      if (!validator.isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }),
    password: Joi.string().required().messages({
      'any.required': 'Пароль не указан',
      'string.min': 'Короткий пароль',
    }),
  }),
});

const userInfoValidate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().custom((value, helper) => {
      if (!validator.isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const movieValidate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

const movieIdValidate = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  signupValidate,
  signinValidate,
  userInfoValidate,
  movieValidate,
  movieIdValidate,
};
