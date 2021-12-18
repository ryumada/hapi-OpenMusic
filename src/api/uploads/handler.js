/**
 * A class to handle upload files
 */
class UploadsHandler {
  /**
   * @param {class} service used to access database model
   * @param {class} validator used to validate user inputs
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  /**
   * A function to upload an image
   * @param {object} request.payload.data the data of uploaded file taken from
   * request variable
   * @param {object} h from hapi to create response
   * @return {response} the object of successful response
   */
  async postUploadImageHandler({payload: {data}}, h) {
    this._validator.validateImageHeaders(data.hapi.headers);

    const filename = await this._service.writeFile(data, data.hapi);

    const response = h.response({
      status: 'success',
      data: {
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
