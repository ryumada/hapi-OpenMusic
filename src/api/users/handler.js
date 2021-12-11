/**
 * A class to handle users request
 */
class UsersHandler {
  /**
   * @param {class} service used to access database mode
   * @param {class} validator used to validate user inputs
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // INFO don't forget to bind 'this' if you using it
    this.postUserHandler = this.postUserHandler.bind(this);
  }

  /**
   * A function to handle user adding to the API
   * @param {object} request.payload from hapi to take payload from client
   * @param {object} h from hapi to create response
   * @return {object} send response to client
   */
  async postUserHandler({payload}, h) {
    try {
      this._validator.validateUserPayload(payload);

      const userId = await this._service.addUser(payload);

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan, Selamat datang :D',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      // kembalikan error biar diproses sama server.ext 'onPreResponse'
      return error;
    }
  }
}

module.exports = UsersHandler;
