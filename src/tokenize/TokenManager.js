const Jwt = require('@hapi/jwt');
const InvariantError = require('../errors/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(
      payload,
      process.env.ACCESS_TOKEN_KEY,
  ),
  /*
   * buat ACCESS_TOKEN_KEY dengan menjalankan kode berikut di node REPL,
   *  -----------------------------------------------------
   * > node
   * > require('crypto').randomBytes(64).toString('hex');
   *  -----------------------------------------------------
   */
  generateRefreshToken: (payload) => Jwt.token.generate(
      payload,
      process.env.REFRESH_TOKEN_KEY,
  ),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const {payload} = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
