/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(23)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(25)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(21)',
      notNull: true,
    },
  });

  /**
   * Menambahkan constraint UNIQUE, kombinasi dari kolom playlist_id dan user_id
   * Guna menghindari duplikasi data antara keduanya
   */
  pgm.addConstraint(
      'collaborations',
      'unique_playlist_id_and_user_id',
      'UNIQUE(playlist_id, user_id)',
  );

  // kasih foreign key constraint untuk playlist_id dan song_id
  pgm.addConstraint(
      'collaborations',
      'fk_collaborations.playlist_id_playlists.id',
      'FOREIGN KEY(playlist_id) REFERENCES playlists(id)',
  );
  pgm.addConstraint(
      'collaborations',
      'fk_collaborations.user_id_users.id',
      'FOREIGN KEY(user_id) REFERENCES users(id)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
