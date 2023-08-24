const { rabbitSettings, checkRabbitMQServerStatus } = require('../Config/rabbitConfig'); // Import the RabbitMQ settings and checkRabbitMQServerStatus function
const amqp = require('amqplib');
const axios = require('axios');

// these are with config local in the code 
const getQueueState = (messageCount, consumerCount) => {
  // Helper function to calculate the queue state
  console.log('Message Count:', messageCount);
  console.log('Consumer Count:', consumerCount);

  if (messageCount === 0 && consumerCount === 0) {
    return 'Idle';
  } else if (messageCount > 0 && consumerCount === 0) {
    return 'Backlogged';
  } else if (messageCount > 0 && consumerCount > 0) {
    return 'Active';
  } else {
    return 'Unknown';
  }
};
const getQueueWithParams = async (req, res) => {
  try {
    // Check if the RabbitMQ server is up and reachable
    const isServerUp = await checkRabbitMQServerStatus();
    if (!isServerUp) {
      console.error('RabbitMQ server is down or not reachable');
      return res.status(500).json({ error: 'RabbitMQ server is down or not reachable' });
    }

    const qParams = req.params.qu;

    // Connect to RabbitMQ server
    const conn = await amqp.connect(rabbitSettings);
    const channel = await conn.createChannel();

    // Get queue details
    const queueInfo = await channel.checkQueue(qParams);

    if (!queueInfo) {
      console.error('Error occurred: queue not found');
      await channel.close();
      await conn.close();
      return res.status(500).json({ error: 'Queue not found' });
    } else {
      const { messageCount, consumerCount } = queueInfo;

      // Array to collect received messages
      const receivedMessages = [];

      // Consume messages from the queue
      channel.consume(qParams, (message) => {
        try {
          // Here, we handle the raw message content without assuming it's JSON
          const content = message.content.toString();

          // Check the message type or format
          // For example, you might have a header field 'contentType' to indicate the message type
          // In this example, we assume the message format is plain text if no contentType is provided
          const contentType = message.properties.contentType;
          if (contentType === 'application/json') {
            // If it's JSON, parse the message
            receivedMessages.push(JSON.parse(content));
          } else {
            // If it's plain text or other formats, treat it as a string
            receivedMessages.push(content);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
          receivedMessages.push('Error parsing message');
        }
      }, { noAck: false });

      // Close the channel and connection after a certain period of time
      setTimeout(async () => {
        await channel.close();
        await conn.close();

        // Calculate the queue state based on the message count and consumer count
        const queueState = getQueueState(messageCount, consumerCount);

        // Send the collected messages, queue state, and additional queue details as the API response
        res.json({
          messages: receivedMessages,
          state: queueState,
          queue: {
            qParams,
            messageCount,
            consumerCount,
          },
        });
      }, 5000); // Adjust the timeout as needed
    }
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const getAllMessagesFromQueue = async (req, res) => {
  try {
    // Check if the RabbitMQ server is up and reachable
    const isServerUp = await checkRabbitMQServerStatus();
    if (!isServerUp) {
      console.error('RabbitMQ server is down or not reachable');
      return res.status(500).json({ error: 'RabbitMQ server is down or not reachable' });
    }

    // Connect to RabbitMQ server
    const conn = await amqp.connect(rabbitSettings);
    const channel = await conn.createChannel();

    const queueName = req.params.qu;

    // Get queue details
    const queueInfo = await channel.checkQueue(queueName);

    if (!queueInfo) {
      console.error('Error: Queue not found');
      await channel.close();
      await conn.close();
      return res.status(500).json({ error: 'Queue not found' });
    } else {
      const { messageCount } = queueInfo;

      // Array to collect received messages
      const receivedMessages = [];

      // Consume messages from the queue
      await channel.consume(
        queueName,
        (message) => {
          try {
            // Here, we handle the raw message content without assuming it's JSON
            const content = message.content.toString();
            receivedMessages.push(content);
          } catch (error) {
            console.error('Error parsing message:', error);
            receivedMessages.push('Error parsing message');
          }
        },
        { noAck: false }
      );

      // Close the channel and connection
      await channel.close();
      await conn.close();

      // Send the collected messages as the API response
      return res.json(receivedMessages);
    }
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};



const checkRabbitMQServer = async (req, res) => {
  const { rabbitmqHostname, rabbitmqPort, rabbitmqUsername, rabbitmqPassword } = req.body;

  const connectionUrl = `http://${rabbitmqUsername}:${rabbitmqPassword}@${rabbitmqHostname}:${rabbitmqPort}`;

  try {
    const conn = await amqp.connect(connectionUrl);
    await conn.close();
    res.json("Success"); // Send "Success" if the server is up and reachable
    console.log("server rabbit is up");
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      res.status(500).json({ error: "Invalid Hostname" });
    } else if (error.message.includes("PossibleAuthenticationFailureException")) {
      res.status(500).json({ error: "Incorrect Password" });
    } else {
      res.status(500).json({ error: "Unknown Error" });
    }
    console.log("server rabbit is down");
  }
};

const QUEUE_SIZE_THRESHOLD = 100; // Define the threshold for queue size
const MESSAGE_ERROR_THRESHOLD = 0.1; // Define the threshold for message error rate (10%)

const calculateErrorRate = (queue) => {
  const totalMessages = queue.messages;
  const totalDeliverGet = queue.message_stats && queue.message_stats.deliver_get ? queue.message_stats.deliver_get : 0;
  
  if (totalMessages === 0 || totalDeliverGet === 0) {
    return 0;
  }
  
  return (totalMessages - totalDeliverGet) / totalMessages;
};

const getQueueCount = async (req, res) => {
  try {
    const { rabbitmqHostname, rabbitmqPort, rabbitmqUsername, rabbitmqPassword } = req.body;

    if (!rabbitmqHostname || !rabbitmqPort || !rabbitmqUsername || !rabbitmqPassword) {
      return res.status(400).json({ error: 'Incomplete configuration provided in the request body.' });
    }

    const isServerUp = await checkRabbitMQServerStatus(rabbitmqHostname, rabbitmqPort, rabbitmqUsername, rabbitmqPassword);
    if (!isServerUp) {
      console.error('RabbitMQ server is down or not reachable');
      return res.status(500).json({ error: 'RabbitMQ server is down or not reachable' });
    }

    // Fetch a list of queues using the RabbitMQ management API
    const rabbitMqBaseUrl = `http://${rabbitmqHostname}:${rabbitmqPort}`;

    const config = {
      auth: {
        username: rabbitmqUsername,
        password: rabbitmqPassword,
      },
    };

    try {
      const response = await axios.get(`${rabbitMqBaseUrl}/api/queues`, config);

      if (response.status === 200) {
        const queues = response.data;
        const queueCount = queues.length;
        const failedQueues = queues.filter(queue => queue.messages > QUEUE_SIZE_THRESHOLD || calculateErrorRate(queue) > MESSAGE_ERROR_THRESHOLD);

        console.log('Queue Count:', queueCount);
        console.log('Failed Queues:', failedQueues);

        return res.json({ queueCount, failedQueues });
      } else {
        console.error('Failed to get queue count:', response.statusText);
        return res.status(500).json({ error: 'Failed to get queue count' });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Incorrect RabbitMQ password');
        return res.status(401).json('Incorrect RabbitMQ password');
      }

      console.error('Error occurred:', error.message);
      return res.status(500).json({ error: 'Error occurred' });
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
    return res.status(500).json({ error: 'Error occurred' });
  }
};

const checkEmptyQueues = async (req, res) => {
  const { rabbitmqHostname, rabbitmqPort, rabbitmqUsername, rabbitmqPassword } = req.body;

  const rabbitMqBaseUrl = `http://${rabbitmqHostname}:${rabbitmqPort}`;
  
  const config = {
    auth: {
      username: rabbitmqUsername,
      password: rabbitmqPassword,
    },
  };

  try {
    const response = await axios.get(`${rabbitMqBaseUrl}/api/queues`, config);

    if (response.status === 200) {
      const queues = response.data;
      const emptyQueues = [];
      let totalQueues = 0;

      for (const queue of queues) {
        totalQueues++;
        if (queue.messages === 0) {
          emptyQueues.push(queue.name);
        }
      }

      const result = {
        totalQueues,
        emptyQueuesCount: emptyQueues.length,
        emptyQueues,
      };

      res.json(result);
      console.log(result);
    } else {
      console.error('Failed to get queue list:', response.statusText);
      res.status(500).json({ error: 'Failed to get queue list' });
    }
  } catch (error) {
    console.error('Error checking empty queues:', error);
    res.status(500).json({ error: 'Error checking empty queues' });
  }
};


const checkQueueExistence = async (req, res) => {
  try {

    // Get configurations from the request body
    const { rabbitmqHostname, rabbitmqPort, rabbitmqUsername, rabbitmqPassword, qu } = req.body;

    // Connect to RabbitMQ server
    const conn = await amqp.connect(`amqp://${rabbitmqUsername}:${rabbitmqPassword}@${rabbitmqHostname}:${rabbitmqPort}`);
    const channel = await conn.createChannel();

    // Check if the queue exists
    const queueInfo = await channel.checkQueue(qu);

    await channel.close();
    await conn.close();

    if (queueInfo) {
      // Queue exists
      res.json({ exists: true });
    } else {
      // Queue does not exist
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

//send for test
const sendMessageWithDeadLetter = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { queueName, message } = req.body;

    // Connect to RabbitMQ server
    const connectionUrl = 'amqp://eya:eya@localhost:5672/'; // Replace with your RabbitMQ connection URL
    const connection = await amqp.connect(connectionUrl);
    const channel = await connection.createChannel();

    // Declare the dead letter exchange and queue
    const dlxExchange = 'dlx_exchange';
    const dlqQueue = 'dlq_queue';

    await channel.assertExchange(dlxExchange, 'fanout', { durable: true });
    await channel.assertQueue(dlqQueue, { durable: true });
    await channel.bindQueue(dlqQueue, dlxExchange, '');

    // Declare the main queue with dead letter settings
    await channel.assertQueue(queueName, {
      durable: true,
      deadLetterExchange: dlxExchange,
      deadLetterRoutingKey: dlqQueue,
    });

    // Send the message to the specified queue
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log(`Message sent to queue: ${queueName}`);

    // Close the channel and connection after sending the message
    await channel.close();
    await connection.close();

    // Send a success response
    res.status(200).json({ message: 'Message sent successfully' });

  } catch (error) {
    console.error('Error:', error);

    // Send an error response
    res.status(500).json({ error: 'An error occurred while sending the message' });
  }
};

//get queue with DLX infor
const getQueuesWithDLXInfo = async (req, res) => {
  try {
    const { port, address, username, password } = req.body;

    const rabbitMQConfig = {
      baseURL: `http://${address}:${port}/api`,
      auth: {
        username,
        password,
      },
    };

    const response = await axios.get('/queues', rabbitMQConfig);

    const queues = response.data;
    console.log('All Queues:', queues);

    const dlxExchange = 'dlx_exchange'; // Replace with your DLX exchange name

    const dlxConfiguredQueues = queues.filter(queue => {
      const queueArguments = queue.arguments;

      const isDlxConfigured = queueArguments &&
        queueArguments['x-dead-letter-exchange'] === dlxExchange &&
        queueArguments['x-dead-letter-exchange'] !== ''; // Include non-empty DLX exchange

      return isDlxConfigured;
    });

    const dlxQueueNames = dlxConfiguredQueues.map(queue => queue.name);
    const dlxQueueCount = dlxQueueNames.length;

    const result = {
      dlxQueueNames,
      dlxQueueCount,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);

    // Handle connection error or any other error
    if (error.code === 'ECONNREFUSED') {
      res.status(500).json({ error: 'Connection to RabbitMQ refused.' });
    } else {
      res.status(500).json({ error: 'An error occurred.' });
    }
  }
};




// send for test TTL
  const QUEUE_NAME = 'second';
  const TTL = 5000; // TTL in milliseconds (5 seconds)
  
  async function sendMessageWithTTL() {
    try {
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
  
      await channel.assertQueue(QUEUE_NAME, { durable: true });
  
      const message = 'Hello, TTL!';
      const options = {
        expiration: TTL.toString() // Set the expiration (TTL) in milliseconds
      };
  
      channel.sendToQueue(QUEUE_NAME, Buffer.from(message), options);
  
      console.log(`Message sent to ${QUEUE_NAME} with TTL of ${TTL}ms`);
  
      setTimeout(async () => {
        // Simulate checking for expired messages
        const { messageCount } = await channel.checkQueue(QUEUE_NAME);
        console.log(`Number of messages remaining in the queue: ${messageCount}`);
  
        connection.close();
      }, TTL + 1000); // Wait for TTL + 1 second before checking the queue
    } catch (error) {
      console.error('Error:', error);
    }
  }
//end send for test TTL 

// send test unroutable msgs
  
  async function sendUnroutableMessages() {
    try {
      const connectionUrl = 'amqp://eya:eya@localhost:5672/'; // Replace with your RabbitMQ connection URL
      const connection = await amqp.connect(connectionUrl);
            const channel = await connection.createChannel();
  
      await channel.assertQueue("dlq_queue", { durable: true });
  
      for (let i = 0; i < 1000; i++) {
        const message = `Unroutable message ${i}`;
        const options = { expiration: '1000' }; // Temps d'expiration court pour que les messages deviennent non livrables
  
        channel.sendToQueue(queueName, Buffer.from(message), options);
      }
  
      await channel.close();
      await connection.close();
      console.log('Sent unroutable messages.');
    } catch (error) {
      console.error('Error:', error);
    }

  }


const checkUnroutableQueues = async (req, res) => {
  const { host, port, username, pass } = req.body;

  const rabbitMqBaseUrl = `http://${host}:${port}`;
  
  const config = {
    auth: {
      username: username,
      password: pass,
    },
  };

  try {
    const response = await axios.get(`${rabbitMqBaseUrl}/api/queues`, config);

    if (response.status === 200) {
      const queues = response.data;
      const unroutableQueues = [];
      let totalQueues = 0;

      for (const queue of queues) {
        totalQueues++;
        if (queue.messages > queue.consumers) {
          unroutableQueues.push(queue.name);
        }
      }

      const result = {
        totalQueues,
        unroutableQueuesCount: unroutableQueues.length,
        unroutableQueues,
      };

      res.json(result);
      console.log(result);
    } else {
      console.error('Failed to get queue list:', response.statusText);
      res.status(500).json({ error: 'Failed to get queue list' });
    }
  } catch (error) {
    console.error('Error checking unroutable queues:', error);
    res.status(500).json({ error: 'Error checking unroutable queues' });
  }
};

const processQueueInformation = async (req, res) => {
  const { rabbitmqHostname, rabbitmqPort, rabbitmqUsername, rabbitmqPassword, host, port, username, pass, address } = req.body;

  const rabbitMqBaseUrl = `http://${rabbitmqHostname}:${rabbitmqPort}`;

  const config = rabbitmqUsername && rabbitmqPassword ? {
    auth: {
      username: rabbitmqUsername,
      password: rabbitmqPassword,
    },
  } : undefined;

  try {
    if (config) {
      const queuesResponse = await axios.get(`${rabbitMqBaseUrl}/api/queues`, config);
      const queues = queuesResponse.data;

      const emptyQueues = new Set();
      const unroutableQueues = new Set();
      const dlxQueueNames = new Set();
      const failedQueueNames = new Set();

      for (const queue of queues) {
        // Check empty queues
        if (queue.messages === 0) {
          emptyQueues.add(queue.name);
          failedQueueNames.add(queue.name);
        }
        
        // Check unroutable queues
        if (queue.messages > queue.consumers) {
          unroutableQueues.add(queue.name);
          failedQueueNames.add(queue.name);
        }

        // Check DLX configured queues
        const queueArguments = queue.arguments;
        const dlxExchange = 'dlx_exchange'; // Replace with your DLX exchange name
        const isDlxConfigured = queueArguments &&
          queueArguments['x-dead-letter-exchange'] === dlxExchange &&
          queueArguments['x-dead-letter-exchange'] !== ''; // Include non-empty DLX exchange
        if (isDlxConfigured) {
          dlxQueueNames.add(queue.name);
          failedQueueNames.add(queue.name);
        }
      }

      // Prepare the final response
      const result = {
        totalQueues: queues.length,
        totalFailedQueues: failedQueueNames.size,
        totalEmptyQueues: emptyQueues.size,
        totalUnroutableQueues: unroutableQueues.size,
        failedQueueNames: [...failedQueueNames],
        emptyQueueNames: [...emptyQueues],
        unroutableQueueNames: [...unroutableQueues],
        dlxQueueNames: [...dlxQueueNames],
      };

      res.json(result);
    } else {
      console.error('Config is not provided');
      res.status(400).json({ error: 'Config is not provided' });
    }
  } catch (error) {
    console.error('Error processing queue information:', error);
    res.status(500).json({ error: 'An error occurred.' });
  }
};


const testRabbitMQServer = async (req,res) => {
  const {
    rabbitmqUsername,
    rabbitmqPassword,
    rabbitmqHostname,
    rabbitmqPort
  } = req.body;

  const connectionUrl = `amqp://${rabbitmqUsername}:${rabbitmqPassword}@${rabbitmqHostname}:${rabbitmqPort}`;

  try {
    const conn = await amqp.connect(connectionUrl);
    await conn.close();
    res.json({ status: "Success", message: "RabbitMQ server is up and reachable" });
  } catch (error) {
    console.error('Error:', error);
    res.json({ status: "Error", message: "Connection Error", details: error.message });
  }
}


module.exports = {
  //config code
  getQueueWithParams,
  getAllMessagesFromQueue,
  //config from body 
  getQueueCount,
  checkRabbitMQServer,
  checkEmptyQueues,
  checkQueueExistence,
  sendMessageWithDeadLetter,
  getQueuesWithDLXInfo,
  sendMessageWithTTL,
  sendUnroutableMessages,
  checkUnroutableQueues,


  processQueueInformation,

  testRabbitMQServer
  

};
