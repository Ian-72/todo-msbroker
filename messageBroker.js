require('dotenv').config();
const amqp = require('amqplib');
const TodoService = require('./src/services/db/TodoService');

const Producer = {
  sendMessage: async (queue, message) => {
    // Koneksi ke server rabbitmq dan buat channel
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    // Menambakan ke queue
    await channel.assertQueue(queue, {
      durable: true,
    });

    // ! -------------------------
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    // Memberi delay
    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

const Consumer = {
  consume: async (queue, service, queueDest) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    // ! -------------------------
    await channel.consume(queue, async (message) => {
      const data = service(JSON.parse(message.content));
      await Producer.sendMessage(queueDest, JSON.stringify(data));
    }, { noAck: true });
  },
};

const msgBroker = async () => {
  const { consume } = Consumer;

  const cTodoInChannel = 'req.create.todo';
  const cTodoOutChannel = 'todo.created';

  // READ MESSAGE from req.create.todo
  await consume(cTodoInChannel, TodoService.addTodo, cTodoOutChannel);

  const dTodoInChannel = 'req.delete.todo';
  const dTodoOutChannel = 'todo.deleted';

  await consume(dTodoInChannel, TodoService.deleteTodo, dTodoOutChannel);
};

module.exports = { Producer, Consumer, msgBroker };
