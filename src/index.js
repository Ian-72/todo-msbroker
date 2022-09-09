const Hapi = require('@hapi/hapi');
const { host, port } = require('./config/connection');
const { msgBroker } = require('../messageBroker');

const Todo = require('./api/todo');
const TodoService = require('./services/db/TodoService');

(async () => {
  // Start messagebroker daemon
  await msgBroker();

  // Define Hapi server
  const server = Hapi.server({
    host,
    port,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: Todo,
    options: {
      service: TodoService,
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
})();
