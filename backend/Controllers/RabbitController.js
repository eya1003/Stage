const { rabbitSettings, checkRabbitMQServerStatus } = require('../Config/rabbitConfig'); // Import the RabbitMQ settings and checkRabbitMQServerStatus function
const amqp = require('amqplib');
const axios = require('axios');

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
/*
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
*/
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


const getQueueNames = async (req,res) => {
  try {
    // Check if the RabbitMQ server is up and reachable
    const isServerUp = await checkRabbitMQServerStatus();
    if (!isServerUp) {
      console.error('RabbitMQ server is down or not reachable');
      return null;
    }

    // Fetch a list of queues using the RabbitMQ management API
    const rabbitMqBaseUrl = 'http://127.0.0.1:15672';
    const username = 'guest'; // Replace with your RabbitMQ username (usually 'guest')
    const password = 'guest'; // Replace with your RabbitMQ password (usually 'guest')

    const config = {
      auth: {
        username,
        password,
      },
    };

    const response = await axios.get(`${rabbitMqBaseUrl}/api/queues`, config);

    if (response.status === 200) {
      const queueNames = response.data.map((queue) => queue.name);
      console.log('Queue Names:', queueNames);
      res.json(queueNames)
      return queueNames;
    } else {
      console.error('Failed to get queue names:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
    return [];
  }
};
module.exports = {
  getQueueWithParams,
  getAllMessagesFromQueue,
  getQueueNames
};
