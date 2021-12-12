const ClientError = require('./ClientError');

/**
 * A class to generate Authentication Error
 */
class AuthenticationError extends ClientError {
  /**
   * @param {string} message this is used to show what the error is to client
   */
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationsError';
  }
}

module.exports = AuthenticationError;
