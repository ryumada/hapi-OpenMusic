/* eslint-disable camelcase */

/**
 * this is for map template to replace attribute using underscore to camelCase
 * @param {object} result object retrieved from postgreSQL
 * @return {object} result object using camelCase
 */
const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

const mapSomeDBToModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

module.exports = {mapDBToModel, mapSomeDBToModel};
