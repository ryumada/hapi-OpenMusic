const {Pool} = require('pg');
const InvariantError = require('../../errors/InvariantError');

/**
 * password: Joi.string().min(6).required
 * A class to manage authentications table in postgre db
 */
class AuthenticationsService {
  /**
   * A constructor function for the class
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * A function to add refreshToken to the database
   * @param {string} token this is a refreshToken to be added to database
   */
  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  /**
   * A function to verify that the token is exist
   * in the database
   * @param {string} token to be verified
   */
  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid.');
    }
  }

  /**
   * A function to delete a token from the database
   * @param {string} token to be deleted
   */
  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
