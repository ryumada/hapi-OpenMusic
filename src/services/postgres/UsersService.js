const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../errors/InvariantError');
const AuthenticationError = require('../../errors/AuthenticationError');

/**
 * A class to manage users
 */
class UsersService {
  /**
   * A constructor function for the class
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * A function to add a user to the application.
   * @param {object} userDetails deconstructured object for user authentication
   * {
   *    @param {string} username for user registration
   *    @param {string} password for the main security
   *    @param {string} fullname to label the name of user
   * }
   */
  async addUser({username, password, fullname}) {
    /**
     * data taken from the parameter above should be validated first
     * in the handler
     */
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (! result.rowCount) {
      throw new InvariantError('User gagal ditambahkan, sial :(');
    }

    return result.rows[0].id;
  }

  /**
   * A function to verify that the username inputted by user not registered
   * in the server.
   * @param {string} username for user registration needed, and this is unique
   */
  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError(
          'Gagal menambahkan user. Username telah digunakan',
      );
    }
  }

  /**
   * A function to verify user credentials
   * @param {string} username of the user to login destructured from payload
   * @param {string} password of the user to login destructured from payload
   * @return {id/AuthenticationError} id of the user or AuthenticationsError
   */
  async verifyUserCredentials(username, password) {
    const messageCredentialError = 'Kredensial yang anda berikan salah';

    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError(messageCredentialError);
    }

    const {id, password: hashedPassword} = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError(messageCredentialError);
    }

    return id;
  }
}

module.exports = UsersService;
