const { MQ } = require('ibmmq');
const { MQC } = require('ibmmq');
const { MQMD } = require('ibmmq');
const { MQGMO } = require('ibmmq');
const { MQOD } = require('ibmmq');

const getQueueWithParams = async (req, res) => {
  try {
    // Connect to IBM MQ
    const connectionOptions = {
      // Update with your IBM MQ connection details
      QMGR: 'QMGR_NAME',
      QUEUE_NAME: 'QUEUE_NAME',
      HOST: 'MQ_HOST',
      PORT: MQC.MQ_PORT,
      CHANNEL: 'CHANNEL_NAME',
      USERID: 'USERNAME',
      PASSWORD: 'PASSWORD',
    };

    const connection = await MQ.Conn(connectionOptions);
    const objectDescriptor = new MQOD();
    objectDescriptor.ObjectName = connectionOptions.QUEUE_NAME;

    // Open the queue for getting details
    const openOptions = MQC.MQOO_INQUIRE;
    const queue = await connection.OpenPromise(objectDescriptor, openOptions);

    // Get queue details
    const queueInfo = await queue.InqPromise();

    // Extract specific properties
    const {
      ObjectName: queueName,
      CurrentQDepth: messageCount,
      OpenInputCount: consumerCount,
    } = queueInfo;

    // Array to collect received messages
    const receivedMessages = [];

    // Get messages from the queue
    const getOptions = new MQGMO();
    getOptions.Options = MQC.MQGMO_WAIT | MQC.MQGMO_CONVERT;
    getOptions.WaitInterval = MQC.MQWI_UNLIMITED;

    while (true) {
      const md = new MQMD();
      const message = new Buffer.alloc(10240); // Buffer size for received message

      try {
        await queue.GetPromise(md, getOptions, message);
        const receivedMessage = message.toString().trim();
        receivedMessages.push(receivedMessage);
      } catch (error) {
        if (error.mqrc === MQC.MQRC_NO_MSG_AVAILABLE) {
          // No more messages available
          break;
        } else {
          console.error('Error occurred while getting message:', error);
        }
      }
    }

    // Close the queue and connection
    await queue.ClosePromise();
    await connection.ClosePromise();

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

