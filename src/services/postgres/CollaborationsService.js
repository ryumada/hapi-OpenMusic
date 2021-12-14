// TODO Get playlist owned by collaborator and owned
// TODO add songs to collaborated playlist
// TODO get songs from collaborated playlist
// TODO delete songs from collaborated playlist
// TODO verify the owner and the collaborator

const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const InvariantError = require('../../errors/InvariantError');

/**
 * A class to manage collaborations in the database
 */
class CollaborationsService {
  /**
   * A constructor function for the class
   */
  constructor() {
    this._pool = new Pool;
  }

  /**
   * A function to add collaboration
   * @param {string} playlistId which playlist to collaborated
   * @param {string} userId which user will be added to the collaborated
   * playlist
   */
  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * A function to delete collaboration
   * @param {string} playlistId which playlist to delete the collaboration
   * @param {string} userId which is the user to delete its collaboration
   */
  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: `DELETE FROM collaborations
      WHERE playlist_id = $1 AND user_id = $2
      RETURNING id`,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }

  /**
   * A function to verify that the collaboration is exist
   * @param {string} playlistId which playlist to be verified
   * @param {string} userId which user to be verified
   */
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: `SELECT id FROM collaborations
      WHERE playlist_id = $1 AND user_id = $2`,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
