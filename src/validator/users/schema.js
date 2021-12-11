const Joi = require('joi');

const UsersPayloadSchema = Joi.object({
  username: Joi.string().min(3).max(64).required(),
  password: Joi.string().min(6).required(),
  fullname: Joi.string().max(128).required(),
});

module.exports = UsersPayloadSchema;
