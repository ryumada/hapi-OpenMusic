/* eslint-disable camelcase */

/**
 * this is for map template to replace attribute using underscore to camelCase
 * @param {object} result object retrieved from postgreSQL
 * @return {object} result object using camelCase
 */
const mapDBToModel = ({inserted_at, updated_at, ...args}) => ({
  ...args,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = {mapDBToModel};
