const Joi = require('joi');
const date = new Date();

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(date.getFullYear()).required(),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number(),
});

module.exports = SongsPayloadSchema;
