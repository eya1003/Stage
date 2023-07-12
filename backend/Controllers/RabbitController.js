const createChannel = require('../Config/rabbitConfig');
const amqp = require('amqplib');
const getQueueMessages = async (req, res) => {
  try {
    // Create channel
    const channel = await createChannel();

    const queue = 'first';

    // Assert queue
    await channel.assertQueue(queue);
    console.log('Queue created...');

    // Get queue details
    const queueInfo = await channel.checkQueue(queue);

    // Extract specific properties
    const {
      messageCount,
      consumerCount,
      queue: queueName,
    } = queueInfo;

    // Array to collect received messages
    const receivedMessages = [];

    // Consume messages from the queue
    channel.consume(queue, message => {
      let q = JSON.parse(message.content.toString());

      // Collect the received message
      receivedMessages.push(q);
    }, { noAck: true });

    // Close the channel and connection after a certain period of time
    setTimeout(async () => {
    //  await channel.close();
     // await channel.connection.close();

      // Calculate the queue state based on the message count and consumer count
      const queueState = getQueueState(messageCount, consumerCount);

      // Send the collected messages, queue state, and additional queue details as the API response
      res.json({
        messages: receivedMessages,
        state: queueState,
        queue: {
          name: queueName,
          messageCount,
          consumerCount,
        }
      });
    }, 5000); // Adjust the timeout as needed

  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

// Helper function to calculate the queue state
const getQueueState = (messageCount, consumerCount) => {
  console.log('Message Count:', messageCount);
  console.log('Consumer Count:', consumerCount);

  if (messageCount === 0 && consumerCount === 0) {

    //"idle" = no messages were published for a predefined amount of time.

    return 'Idle';
  } else if (messageCount > 0 && consumerCount === 0) {
      //

    return 'Backlogged';
  } else if (messageCount > 0 && consumerCount > 0) {
    //
    return 'Active';
  } else {
    return 'Unknown';
  }
};


// function worked with success in react

const getQueueWithParams = async (req, res) => {
  try {

    // Create channel
    const channel = await createChannel();

    const qParams = req.params.qu;


    // Get queue details
    const queueInfo = await channel.checkQueue(qParams);
    if (!queueInfo){
      console.error('Error occurred queue not found :', error);
      res.status(500).json({ error: 'queue not found' });
    }
else {
    // Extract specific properties
    const {
      qParams,
      messageCount,
      consumerCount,
    } = queueInfo;

    // Array to collect received messages
    const receivedMessages = [];

    // Consume messages from the queue
    channel.consume(qParams, message => {
      let q = JSON.parse(message.content.toString());

      // Collect the received message
      receivedMessages.push(q);
    }, { noAck: true });

    // Close the channel and connection after a certain period of time
    setTimeout(async () => {
     await channel.close();
     await channel.connection.close();

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
        }
      });
    }, 5000); // Adjust the timeout as needed
  }
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const getQueueWithParams1 = async (req, res) => {
    try {
      // Create channel
      const channel = await createChannel();
  
      const qParams = req.params.qu;
  
      // Get queue details
      const queueInfo = await channel.checkQueue(qParams);
      if (!queueInfo) {
        console.error('Error occurred queue not found :', error);
        res.status(500).json({ error: 'queue not found' });
      } else {
        // Extract specific properties
        const {
          qParams,
          messageCount,
          consumerCount,
        } = queueInfo;
  
        // Array to collect received messages
        const receivedMessages = [];
  
        // Consume messages from the queue
        channel.consume(qParams, message => {
          let q = JSON.parse(message.content.toString());
  
          // Collect the received message
          if (q === '') {
            receivedMessages.push('Empty');
          } else {
            receivedMessages.push(q);
          }
        }, { noAck: true });
  
        // Close the channel and connection after a certain period of time
        setTimeout(async () => {
          await channel.close();
          await channel.connection.close();
  
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
  

module.exports = {
  getQueueMessages,
  getQueueWithParams,
  getQueueWithParams1
};
