/**
 * A handler class to manage collaboration request
 */
class CollaborationsHandler {
  /**
   * @param {instance} collaborationsService
   * @param {instance} playlistsService
   * @param {JoiObject} validator
   */
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler
        .bind(this);
  }

  /**
   * A function to add collaboration
   * @param {object} request request parameter from hapi requests
   * @param {object} h to make the responses
   * @return {response/error}
   */
  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const {id: credentialId} = request.auth.credentials;
    const {playlistId, userId} = request.payload;

    await this._playlistsService
        .verifyPlaylistAccess(playlistId, credentialId);
    const collaborationId = await this._collaborationsService
        .addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan ke playlist terpilih',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * A function to delete collaboration from the playlist
   * @param {object} request request parameter from hapi requests
   * @return {response/error}
   */
  async deleteCollaborationHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);
    const {id: credentialId} = request.auth.credentials;
    const {playlistId, userId} = request.payload;

    await this._playlistsService
        .verifyPlaylistAccess(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
