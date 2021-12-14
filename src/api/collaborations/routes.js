/**
 * playlists api main routes
 * @param {init} handler to handle the routes
 * @return {array} the routes for api
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
