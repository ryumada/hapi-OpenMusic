const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid(
      'image/apng',
      'image/avif ',
      'image/gif',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
  ).required(),
}).unknown();

/**
 * @unknown dari syntax di atas menunjukkan bahwa objek boleh memiliki properti
 *  apa saja yang penting terdapat properti 'content-type' pada objek
 */

module.exports = {ImageHeadersSchema};
