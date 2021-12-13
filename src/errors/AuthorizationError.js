const ClientError = require('./ClientError');

/**
 * A class to generate Authorization Error
 */
class AuthorizationError extends ClientError {
  /**
   * A constructor function for the class
   * @param {string} message the error message to be displayed to the client
   */
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
