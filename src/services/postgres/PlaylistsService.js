const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const AuthorizationError = require('../../errors/AuthorizationError');
const InvariantError = require('../../errors/InvariantError');
const NotFoundError = require('../../errors/NotFoundError');

/**
 * A Service Class to manage the playlist in the database
 */
class PlaylistsService {
  /**
   * A constructor function for the class
   * @param {instance} collaborationsService the instance that needed for
   * verifying the access of playlist
   */
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  /**
   * A function to add new playlist
   * @param {string} playlistName the name of the playlist
   * @param {string} owner the owner who creates the playlist
   * @return {string} the id returned from query
   */
  async addPlaylist(playlistName, owner) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistName, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * A function to get playlist owned by a user
   * @param {string} owner a userId of the owner
   * @return {object} the result rows contain playlist owned by a user
   */
  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlists.id, users.username`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  /**
   * A function to add a song to the playlist
   * @param {string} playlistId to find which playlist to add a song
   * @param {string} songId the song added to the playlist
   * @return {string} id of a song retrieved from the database
   */
  async addSongToPlaylist(playlistId, songId) {
    const id = `playlistsongs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * A function to get the songs from a playlist
   * @param {string} playlistId the id of the playlist
   * @return {object} the list of songs
   */
  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlistsongs
      LEFT JOIN songs ON songs.id = playlistsongs.song_id
      WHERE playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  /**
   * A function to delete a song from the playlist
   * @param {string} playlistId the id of the playlist
   * @param {string} songId the id of the song
   */
  async deleteSongInPlaylist(playlistId, songId) {
    const query = {
      text: `DELETE FROM playlistsongs
      WHERE playlist_id = $1 AND song_id = $2
      RETURNING id`,
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
  }

  /**
   * A function to delete a playlist
   * @param {string} playlistId the id of the playlist
   */
  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal dihapus');
    }
  }

  /**
   * A function to verify the playlist owner
   * @param {string} playlistId to find which playlist to verify the owner
   * @param {string} owner id of the user to be verified the playlist owner
   */
  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT id, owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini.');
    }
  }

  /**
   * A function to verify is user have access to the playlist
   * Is the user a collaborator or the owner?
   * If not both, give 403
   * @param {*} playlistId which playlist to verify the access
   * @param {*} userId which the user to verify the access
   */
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationsService
            .verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  /**
   * A function to find a song is exist in the playlist
   * @param {string} playlistId the playlist id to be verified
   * @param {stirng} songId to find if the song exist in the playlist
   * @param {boolean} isForDelete is it for deleting the song?
   */
  async verifySongExistence(playlistId, songId, isForDelete = false) {
    const query = {
      text: `SELECT id
      FROM playlistsongs
      WHERE playlist_id = $1 AND song_id = $2`,
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);

    // verify untuk penambahan lagu duplikat
    if (result.rowCount > 0 && !isForDelete) {
      throw new InvariantError('Lagu telah ditambahkan ke playlist');
    }

    // verify untuk penghapusan lagu yang tidak ada
    if (!result.rowCount && isForDelete) {
      throw new InvariantError('Lagu tidak ditemukan di playlist');
    }
  }
}

module.exports = PlaylistsService;
