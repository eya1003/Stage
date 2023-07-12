const { MQQueueManager, MQMD, MQGetMessageOptions } = require('ibm-mq');

const getQueueWithName = async (req, res) => {
  try {
    // Connect to IBM WebSphere MQ
    const connectionOptions = {
      // Update with your IBM WebSphere MQ connection details
      queueManager: 'QMGR_NAME',
      queueName: 'QUEUE_NAME',
      connection: {
        hostname: 'MQ_HOST',
        port: 'MQ_PORT',
        channel: 'CHANNEL_NAME',
        user: 'USERNAME',
        password: 'PASSWORD',
      },
    };

    const queueManager = await new MQQueueManager(connectionOptions.queueManager);

    // Open the queue for getting details
    const openOptions = MQQueueManager.MQOO_INQUIRE;
    const queue = await queueManager.openPromise(connectionOptions.queueName, openOptions);

    // Get queue details
    const queueInfo = await queueManager.inquireQueuePromise(connectionOptions.queueName);

    // Extract specific properties
    const {
      Name: queueName,
      CurrentDepth: messageCount,
      OpenInputCount: consumerCount,
    } = queueInfo;

    // Array to collect received messages
    const receivedMessages = [];

    // Get messages from the queue
    const getOptions = new MQGetMessageOptions();
    getOptions.Options = MQGetMessageOptions.MQGMO_WAIT;
    getOptions.WaitInterval = MQGetMessageOptions.MQWI_UNLIMITED;

    while (true) {
      const md = new MQMD();
      const message = await queue.getAsync(md, getOptions);

      if (message) {
        const receivedMessage = message.Buffer.toString().trim();
        receivedMessages.push(receivedMessage);
      } else {
        // No more messages available
        break;
      }
    }

    // Close the queue and queue manager
    await queue.closeAsync();
    await queueManager.disconnectAsync();

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
      },
    });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};


module.exports = {
  getQueueWithName,
}