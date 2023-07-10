const amqp = require('amqplib');

const rabbitSettings = {
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: 'eya',
  password: 'eya',
  vhost: '/',
  authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
};

const createChannel = async () => {
  try {
    const conn = await amqp.connect(rabbitSettings);
    console.log('Connection created...');
    const channel = await conn.createChannel();
    console.log('Channel created...');
    return channel;
  } catch (err) {
    console.error(`Error connecting to RabbitMQ: ${err}`);
    throw err;
  }
};

module.exports = createChannel;
