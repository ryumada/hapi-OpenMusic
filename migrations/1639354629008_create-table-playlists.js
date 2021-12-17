/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(25)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(128)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(21)',
      notNull: true,
    },
  });

  /**
   * Menambahkan constraint FOREIGN KEY
   * owner di table playlists ke id di table user
   */
  pgm.addConstraint(
      'playlists',
      'fk_playlists.owner_users.id',
      'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
