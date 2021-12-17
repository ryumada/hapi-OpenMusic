/**
 * A class to handle Authentications
 */
class AuthenticationsHandler {
  /**
   * A Constructor method for the class
   * @param {object} authenticationsService An instance that created from \
   * AuthenticationsService class
   * @param {object} usersService An UsersService instance
   * @param {object} tokenManager A TokenManager instance
   * @param {object} validator An Authentications Validator instance
   */
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    // INFO don't forget to bind global "this" variable
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this
        .deleteAuthenticationHandler
        .bind(this);
  }

  /**
   * A function to create an Authentication
   * @param {object} request.payload destructured from request parameter
   * @param {*} h used for creating response
   * @return {h.response/error} if successful / if failed
   */
  async postAuthenticationHandler({payload}, h) {
    await this._validator.validatePostAuthenticationPayload(payload);

    const {username, password} = payload;
    const id = await this._usersService.verifyUserCredentials(
        username,
        password,
    );

    const accessToken = this._tokenManager.generateAccessToken({id});
    const refreshToken = this._tokenManager.generateRefreshToken({id});

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * A function to refresh AccessToken
   * @param {object} request.payload destructured from request parameter
   * @return {response/error} if successful / if failed
   */
  async putAuthenticationHandler({payload}) {
    this._validator.validatePutAuthenticationPayload(payload);

    const {refreshToken} = payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const {id} = await this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({id});
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  /**
   * A function to delete refreshToken
   * @param {object} request.payload destructured from request parameter
   * @return {response/error} if successful / if failed
   */
  async deleteAuthenticationHandler({payload}) {
    this._validator.validateDeleteAuthenticationPayload(payload);

    const {refreshToken} = payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh Token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
