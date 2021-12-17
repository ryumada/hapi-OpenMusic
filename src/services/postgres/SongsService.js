const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../errors/InvariantError');
const NotFoundError = require('../../errors/NotFoundError');
const {mapDBToModel} = require('../../utils');

/**
 * A class to manage song service in open music app
 */
class SongsService {
  /**
   * A constructor function for the class
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * A function to add song
   * @param {init} songDetails object to add to server
   * @return {id} id of inserted song
   */
  async addSong({
    title, year, performer, genre, duration,
  }) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();

    const query = {
      // eslint-disable-next-line max-len
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
      values: [
        id, title, year, performer, genre, duration, insertedAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * A function to get all song from postgre database
   * @return {object} mapped query result
   */
  async getSongs() {
    const result = await this._pool.query(
        'SELECT id, title, performer FROM songs',
    );
    return result.rows;
  }

  /**
   * A function to get a song by id
   * @param {id} id this is retrieved from client
   * @return {object} mapped query result
   */
  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs where id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  /**
   * A function to update a song by using id requested
   * @param {id} id to be called for editing a song
   * @param {object} request.payload destructured object
   */
  async editSongById(id, {title, year, performer, genre, duration}) {
    const updatedAt = new Date().toISOString();

    const query = {
      // eslint-disable-next-line max-len
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  /**
   * A function to delete a song by using id requested
   * @param {id} id retrieved from client
   */
  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = this._pool.query(query);

    if (!(await result).rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }

  /**
   * A function to see if the song exist in the database
   * @param {string} songId id of the song to be looked up
   */
  async verifySongExistence(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan.');
    }
  }
}

module.exports = SongsService;
