/**
 * A class to handle songs api
 */
class SongsHandler {
  /**
   * @param {class} service used to access database mode
   * @param {class} validator used to validate user inputs
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // INFO bind @param {object} this global variable
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  /**
   * A handler function to handle song adding to the API
   * @param {object} request.payload from hapi to take payload from client
   * @param {object} h from hapi to create response
   * @return {object} send response to client
   */
  async postSongHandler({payload}, h) {
    try {
      this._validator.validateSongPayload(payload);
      const {title, year, performer, genre, duration} = payload;
      const songId = await this._service.addSong({
        title, year, performer, genre, duration,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      // kembalikan error biar diproses sama server.ext 'onPreResponse'
      return error;
    }
  }

  /**
   * A handler function to to handle getting all songs
   * @return {object} send response to client
   */
  async getSongsHandler() {
    const songs = await this._service.getSongs();

    // default response code 200 jadinya gaperlu parameter h
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  /**
   * A handler function to handle getting song item by id
   * @param {object} request.params from hapi to take payload from client
   * @param {object} h from hapi to create response
   * @return {object} send response to client
   */
  async getSongByIdHandler({params}, h) {
    try {
      const {id} = params;

      const song = await this._service.getSongById(id);

      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      // kembalikan error biar diproses sama server.ext 'onPreResponse'
      return error;
    }
  }

  /**
   * A handler function to handle editing song item by id
   * @param {object} request from hapi to take payload from client
   * @param {object} h from hapi to create response
   * @return {object} send response to client
   */
  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {id} = request.params;

      await this._service.editSongById(id, request.payload);

      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      };
    } catch (error) {
      // kembalikan error biar diproses sama server.ext 'onPreResponse'
      return error;
    }
  }

  /**
   * A handler function to delete a song by using id requested
   * @param {object} request.params from hapi to take payload from client
   * @param {object} h from hapi to create response
   * @return {object} send response to client
   */
  async deleteSongByIdHandler({params}, h) {
    try {
      const {id} = params;

      await this._service.deleteSongById(id);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (error) {
      // kembalikan error biar diproses sama server.ext 'onPreResponse'
      return error;
    }
  }
}

module.exports = SongsHandler;
