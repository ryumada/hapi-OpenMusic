/**
 * A class to handle playlists
 */
class PlaylistsHandler {
  /**
   * @param {class} playlistsService the instance of PlaylistsService
   * @param {class} songsService the instance of SongsService
   * @param {class} validator used to validate user inputs
   */
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    // INFO bind @param {object} this global variable
    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsInPlaylistHandler = this.getSongsInPlaylistHandler.bind(this);
    this.deleteSongInPlaylistHandler = this
        .deleteSongInPlaylistHandler
        .bind(this);
  }

  /**
   * A function to create a playlist
   * @param {object} request request parameter from hapi requests
   * @param {object} h to make the responses
   * @return {response/error}
   */
  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistPayload(request.payload);
      const {id: credentialId} = request.auth.credentials;
      const {name} = request.payload;

      const playlistId = await this
          ._playlistsService
          .addPlaylist(name, credentialId);

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
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
   * A function to get a playlist owned by the user
   * @param {object} request.auth.credentials got it from hapi request
   * @return {response/error} if successful or fail
   */
  async getPlaylistHandler({auth: {credentials}}) {
    try {
      const {id: credentialId} = credentials;
      const playlists = await this._playlistsService.getPlaylists(credentialId);

      // kembalikan response dengan default status code yaitu 200
      return {
        status: 'success',
        data: {
          playlists,
        },
      };
    } catch (error) {
      // kembalikan error biar diproses sama server.ext 'onPreResponse'
      return error;
    }
  }

  /**
   * A function to delete a playlist
   * @param {object} request request parameter from hapi requests
   * @return {response/error}
   */
  async deletePlaylist(request) {
    try {
      const {playlistId} = request.params;
      const {id: credentialId} = request.auth.credentials;

      await this
          ._playlistsService
          .verifyPlaylistOwner(playlistId, credentialId);
      await this._playlistsService.deletePlaylistById(playlistId);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      // kembalikan error biar diproses sama server.ext 'onPreResponse'
      return error;
    }
  }

  /**
   * A handler function to add a song to the playlist
   * @param {object} request hapi request parameter
   * @param {object} h the parameter to create a response
   * @return {response/error}
   */
  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validatePostSongToPlaylistPayload(request.payload);
      const {id: credentialId} = request.auth.credentials;
      const {songId} = request.payload;
      const {playlistId} = request.params;

      await this
          ._playlistsService
          .verifyPlaylistAccess(playlistId, credentialId);
      await this._songsService.verifySongExistence(songId);
      await this._playlistsService.verifySongExistence(playlistId, songId);
      const playlistsongsId = await this
          ._playlistsService
          .addSongToPlaylist(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
        data: {
          playlistsongsId,
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
   * A handler function to get songs from a playlist
   * @param {object} request hapi request parameter
   * @param {object} h the parameter to create a response
   * @return {response/error}
   */
  async getSongsInPlaylistHandler(request, h) {
    try {
      const {id: credentialId} = request.auth.credentials;
      const {playlistId} = request.params;

      await this._playlistsService
          .verifyPlaylistAccess(playlistId, credentialId);
      const songs = await this._playlistsService
          .getSongsInPlaylist(playlistId);

      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      // kembalikan error biar diproses sama server.ext 'onPreResponse'
      return error;
    }
  }

  /**
   * A handler function to delete a song from the playlist
   * @param {object} request hapi request parameter
   * @return {response/error}
   */
  async deleteSongInPlaylistHandler(request) {
    try {
      this._validator.validateDeleteSongInPlaylistPayload(request.payload);
      const {id: credentialId} = request.auth.credentials;
      const {songId} = request.payload;
      const {playlistId} = request.params;

      await this._playlistsService
          .verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistsService.verifySongExistence(
          playlistId, songId, true,
      );
      await this._playlistsService
          .deleteSongInPlaylist(playlistId, songId);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari Playlist',
      };
    } catch (error) {
      // kembalikan error biar diproses sama server.ext 'onPreResponse'
      return error;
    }
  }
}

module.exports = PlaylistsHandler;
