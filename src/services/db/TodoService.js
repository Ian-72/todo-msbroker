const { randomUUID } = require('crypto');
const moment = require('moment');
const TodoDB = require('../../db/TodoDB');

const TodoService = {
  addTodo: ({ name }) => {
    const newTodo = {
      id: randomUUID(),
      name,
      created: moment().valueOf(),
    };
    // push to array db
    TodoDB.push(newTodo);

    return newTodo;
  },
  getTodos: () => TodoDB,
  deleteTodo: (todo) => {
    const index = TodoDB.findIndex((data) => data.id === todo.id);
    if (index === -1) {
      return false;
    }
    const deletedTodo = TodoDB[index];
    TodoDB.splice(index, 1);

    return deletedTodo;
  },
};

module.exports = TodoService;
