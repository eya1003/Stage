const kafka = require('kafka-node');

// Configuration de l'hôte et du port Kafka
const kafkaHost = 'localhost:9092';

// Configuration des options du client Kafka
const kafkaClientOptions = {
  kafkaHost: kafkaHost,
};

// Création d'un nouveau client Kafka
const client = new kafka.KafkaClient(kafkaClientOptions);

module.exports = {
  client: client,
};
