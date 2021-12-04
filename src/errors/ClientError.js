/**
 * An abstract class to control errors by client
 * Please don't use this class drrectly
 */
class ClientError extends Error {
  /**
   * @param {init} message error message to be generated
   * @param {init} statusCode status code to be generated
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
