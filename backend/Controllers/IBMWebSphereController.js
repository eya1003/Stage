
const { MQC, MQMD, MQGMO } = require('ibmmq');


// Fonction pour se connecter à la file d'attente
const connectToQueueManager = async () => {
  const connectionOptions = {
    queueManager: 'MY_QUEUE_MANAGER',
    host: 'localhost',
    port: 1414,
    channel: 'MY_CHANNEL',
    transportType: 'TCP',
    keyRepository: '/path/to/key/repository',
    certificateLabel: 'MY_CERTIFICATE_LABEL',
    username: 'my_username',
    password: 'my_password',
  };
  

  // Connectez-vous au gestionnaire de file d'attente
  const queueManager = await MQC.promisifiedConnx(connectionOptions);
  return queueManager;
};

// Fonction pour obtenir les détails de la file d'attente
const getQueueDetails = async (queueManager, queueName) => {
  const queueOptions = {
    // Spécifiez les options de la file d'attente telles que le nom de la file d'attente, etc.
  };

  // Ouvrez la file d'attente
  const queue = await queueManager.promisifiedOpen(queueOptions);

  // Obtenez les informations sur la file d'attente
  const queueInfo = await queue.inq();

  // Fermez la file d'attente
  await queue.close();

  return queueInfo;
};

// Fonction pour consommer les messages de la file d'attente
const consumeMessages = async (queueManager, queueName) => {
  
    // Spécifiez les options de la file d'attente telles que le nom de la file d'attente, etc.
  const queueOptions = {
    ObjectName: 'MY_QUEUE',
    ObjectQMgrName: 'MY_QUEUE_MANAGER',
    OpenOptions: MQC.MQOO_INPUT_AS_Q_DEF, // Open the queue for reading
    PutMsgOpts: {
      Persistence: MQC.MQPER_PERSISTENT, // Set message persistence
      Priority: MQC.MQPRI_PRIORITY_AS_Q_DEF, // Set message priority
    },
    GetMsgOpts: {
      MatchOptions: MQC.MQMO_NONE, // Set match options
      WaitInterval: MQC.MQWI_UNLIMITED, // Set wait interval
    },
  };
  
  // Ouvrez la file d'attente
  const queue = await queueManager.promisifiedOpen(queueOptions);

  // Paramètres pour la consommation des messages
  const getMessageOptions = {
    MatchOptions: MQC.MQMO_MATCH_MSG_ID,
    WaitInterval: MQC.MQWI_UNLIMITED,
  };

  // Tableau pour collecter les messages reçus
  const receivedMessages = [];

  // Consommez les messages de la file d'attente
  while (true) {
    const messageDescriptor = new MQMD();
    const getMessageOptions = new MQGMO();

    // Récupérez le message de la file d'attente
    const message = await queue.get(messageDescriptor, getMessageOptions);

    if (message) {
      // Collectez le message reçu
      receivedMessages.push(message);
    } else {
      // Aucun message n'est disponible, arrêtez la consommation
      break;
    }
  }

  // Fermez la file d'attente
  await queue.close();

  return receivedMessages;
};

// Fonction principale pour obtenir la file d'attente avec les paramètres
const getQueueWithName = async (req, res) => {
  try {
    // Connexion au gestionnaire de file d'attente
    const queueManager = await connectToQueueManager();

    const qParams = req.params.qu;

    // Obtenez les détails de la file d'attente
    const queueInfo = await getQueueDetails(queueManager, qParams);

    if (!queueInfo) {
      console.error('Error occurred: queue not found');
      res.status(500).json({ error: 'queue not found' });
    } else {
      // Extrayez les propriétés spécifiques
      const { qParams, messageCount, consumerCount } = queueInfo;

      // Consommez les messages de la file d'attente
      const receivedMessages = await consumeMessages(queueManager, qParams);

      // Fermez la connexion au gestionnaire de file d'attente
      await queueManager.close();

      // Calculez l'état de la file d'attente en fonction du nombre de messages et du nombre de consommateurs
      const queueState = getQueueState(messageCount, consumerCount);

      // Envoyez les messages collectés, l'état de la file d'attente et les détails supplémentaires de la file d'attente en tant que réponse API
      res.json({
        messages: receivedMessages,
        state: queueState,
        queue: {
          qParams,
          messageCount,
          consumerCount,
        },
      });
    }
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};


module.exports = {
  getQueueWithName
}
