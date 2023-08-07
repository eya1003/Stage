// ibmController.js
const net = require('net');
const ibmConfig = require('../Config/IBMWebSphereConfig');
const asyncHandler = require('express-async-handler');

const axios = require('axios');

const getQueueNamesFromWebSphere = async () => {
  try {
    const baseUrl = `https://${ibmConfig.host}:${ibmConfig.httpsTransportPort}/ibm/console/`;

    // Log in to get the session cookie
    const loginUrl = `${baseUrl}j_security_check`;
    const loginData = `j_username=&j_password=`;
    const loginConfig = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    const loginResponse = await axios.post(loginUrl, loginData, loginConfig);

    // Use the session cookie to get the queue names
    const queueUrl = `${baseUrl}com.ibm.ws.console.probdetailhelper.ProblemDetailHelperPortType-getQueueNamesForCurrentUser.json`;
    const queueConfig = {
      headers: { Cookie: loginResponse.headers['set-cookie'] },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    
    const queueResponse = await axios.get(queueUrl, queueConfig);

    // Extract queue names from the response
    const queueNames = queueResponse.data.map((queue) => queue.name);

    console.log('Queue Names:', queueNames);
    return queueNames;
  } catch (error) {
    console.error('Error occurred:', error.message);
    return [];
  }
};




const checkServerStatus = asyncHandler(async (req, res) => {
  const host = ibmConfig.host;
  const adminPort = ibmConfig.adminPort;

  const isServerUp = await checkPortStatus(host, adminPort);

  if (isServerUp) {
    console.log('Server is UP');
    return res.json({ status: 'up' });
  } else {
    console.log('Server is DOWN');
    return res.json({ status: 'down' });
  }
});

function checkPortStatus(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(2000); // Set a timeout for the connection attempt
    socket.on('connect', () => {
      socket.destroy();
      resolve(true); // Port is reachable (server is up)
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false); // Port is not reachable (server is down)
    });

    socket.on('error', (error) => {
      socket.destroy();
      resolve(false); // Port is not reachable (server is down)
    });

    socket.connect(port, host);
  });
}

module.exports = {
  checkServerStatus,
  getQueueNamesFromWebSphere
};
