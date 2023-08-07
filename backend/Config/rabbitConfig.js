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

const checkRabbitMQServerStatus = async () => {
  try {
    const conn = await amqp.connect(rabbitSettings);
    await conn.close();
    return true; // Server is up and reachable
  } catch (error) {
    return false; // Server is down or not reachable
  }
};

module.exports = { rabbitSettings, checkRabbitMQServerStatus };
