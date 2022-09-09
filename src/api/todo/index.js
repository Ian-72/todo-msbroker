const handler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'Todo',
  version: '1.0',
  register: async (server, { service }) => {
    server.route(routes(handler(service)));
  },
};
