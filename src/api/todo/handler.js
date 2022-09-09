const handler = (service) => ({
  getTodoHandler: (req, h) => {
    const todos = service.getTodos();
    return {
      status: 'success',
      data: todos,
    };
  },
});

module.exports = handler;
