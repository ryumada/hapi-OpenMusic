/* eslint-disable camelcase */
/**
 * Conjuction Table used to connect many-to-many relationship tables
 */

exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'VARCHAR(46)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(25)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(21)',
      notNull: true,
    },
  });

  /**
   * Menambahkan constraint UNIQUE, kombinasi dari kolom playlist_id dan song_id
   * Guna menghindari duplikasi data antara keduanya
   */
  pgm.addConstraint(
      'playlistsongs',
      'unique_playlist_id_and_song_id',
      'UNIQUE(playlist_id, song_id)',
  );

  // kasih foreign key constraint untuk playlist_id dan song_id
  pgm.addConstraint(
      'playlistsongs',
      'fk_playlistsongs.playlist_id_playlists.id',
      'FOREIGN KEY(playlist_id) REFERENCES playlists(id)',
  );
  pgm.addConstraint(
      'playlistsongs',
      'fk_playlistsongs.song_id_songs.id',
      'FOREIGN KEY(song_id) REFERENCES songs(id)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlistsongs');
};
