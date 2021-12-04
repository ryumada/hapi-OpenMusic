/* eslint-disable camelcase */
/**
 * remember you need to use underscore instead of using camelCase
 * this is used to create the name of the table attribute
 */

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(21)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(128)',
      notNull: true,
    },
    year: {
      type: 'SMALLINT',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(128)',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(32)',
      notNull: true,
    },
    duration: {
      type: 'SMALLINT',
      notNull: true,
    },
    inserted_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
