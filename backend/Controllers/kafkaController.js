/* const { client } = require('./kafkaConfig');
const Producer = kafka.Producer;
const Consumer = kafka.Consumer;

// Créer un producteur Kafka
const producer = new Producer(client);

// Envoyer un message sur un topic
const sendMessage = (topic, message) => {
  const payloads = [{ topic, messages: [message] }];
  producer.send(payloads, (error, data) => {
    if (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    } else {
      console.log('Message envoyé avec succès:', data);
    }
  });
};

// Créer un consommateur Kafka
const createConsumer = (topic) => {
  const consumer = new Consumer(client, [{ topic }]);
  
  // Consommer les messages d'un topic
  consumer.on('message', (message) => {
    console.log('Message reçu:', message);
  });

  return consumer;
};

module.exports = {
  sendMessage,
  createConsumer,
};
 */
const { client } = require('../Config/kafkaConfig');
const kafka = require('kafka-node');
const Consumer = kafka.Consumer;

const getTopicWithParams = async (req, res) => {
  try {
    const qParams = req.params.qu;

    // Check if the topic exists
    const topicExists = await new Promise((resolve) => {
      client.topicExists([qParams], (error, result) => {
        if (error) {
          console.error('Error checking if topic exists:', error);
          resolve(false);
        } else {
          resolve(result[qParams]);
        }
      });
    });

    if (!topicExists) {
      console.error('Error: Topic not found');
      res.status(404).json({ error: 'Topic not found' });
      return;
    }

    // Create a Kafka consumer
    const consumer = new Consumer(client, [{ topic: qParams }]);

    // Array to collect received messages
    const receivedMessages = [];

    // Consume messages from the topic
    consumer.on('message', (message) => {
      let q = JSON.parse(message.value);

      // Collect the received message
      receivedMessages.push(q);
    });

    // Close the consumer after a certain period of time
    setTimeout(async () => {
      consumer.close(true, () => {
        // Calculate the queue state based on the number of received messages
        const messageCount = receivedMessages.length;
        const queueState = getQueueState(messageCount);

        // Send the collected messages, queue state, and additional queue details as the API response
        res.json({
          messages: receivedMessages,
          state: queueState,
          queue: {
            qParams,
            messageCount,
          }
        });
      });
    }, 5000); // Adjust the timeout as needed
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
  getTopicWithParams
};