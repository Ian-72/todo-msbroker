const routes = (handler) => [
  {
    method: 'GET',
    path: '/todo-items',
    handler: handler.getTodoHandler,
  },
];

module.exports = routes;
