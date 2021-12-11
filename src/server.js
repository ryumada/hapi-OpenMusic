'use strict';

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const ClientError = require('./errors/ClientError');

/* --------------------------------- plugins -------------------------------- */
// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');
// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const songsService = new SongsService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const {response} = request;

    if (response instanceof ClientError) {
      /**
       * membuat response baru dari response toolkit sesuai kebutuhan error
       * handling
       */
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    } else if (response instanceof Error) { // SERVER ERROR
      const newResponse = h.response({
        status: 'error',
        message: 'Maaf terjadi masalah pada server kami',
      });
      newResponse.code(500);
      console.error(response); // tampilkan log error server
      return newResponse;
    }

    /**
     * jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa
     * terintervensi)
     */
    return response.continue || response;
  });

  await server.start();
  console.log('Server berjalan pada %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
