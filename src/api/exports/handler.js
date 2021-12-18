/**
 * A class to handle export songs in a playlist
 */
class ExportsHandler {
  /**
   * @param {class} producerService used to access database mode
   * @param {class} playlistsService used to verify that only the owner or
   * collaborator who can export the songs from a playlist
   * @param {class} validator used to validate user inputs
   */
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  /**
   * A function to create a playlist
   * @param {object} request request parameter from hapi requests
   * @param {object} h to make the responses
   * @return {response/error}
   */
  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const {id: credentialId} = request.auth.credentials;
    const {playlistId} = request.params;

    await this
        ._playlistsService
        .verifyPlaylistAccess(playlistId, credentialId);
    const message = {
      userId: credentialId,
      playlistId: playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._producerService.sendMessage(
        'export:songs',
        JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
