require('dotenv').config();
const amqp = require('amqplib');

const Producer = {
  sendMessage: async (queue, message) => {
    // Koneksi ke server rabbitmq dan buat channel
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    // Menambakan ke queue
    await channel.assertQueue(queue, {
      durable: true,
    });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    // Memberi delay
    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

(async () => {
  const { sendMessage } = Producer;
  const cTodoInChannel = 'req.create.todo';
  const dTodoInChannel = 'req.delete.todo';

  const names = ['Kiki', 'Raja', 'Andre', 'Bogang', 'Dandi'];

  // SEND MESSAGE to req.create.todo
  const result = names.map(async (m) => {
    const todo = { name: m };
    await sendMessage(cTodoInChannel, todo);
    return todo;
  });
  const data = await Promise.all(result);
  console.log(data);
})();
