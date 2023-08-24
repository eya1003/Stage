// ibmController.js
const net = require('net');
const asyncHandler = require('express-async-handler');

const axios = require('axios');



const checkServerStatus = asyncHandler(async (req, res) => {
  const { host, adminPort } = req.body;

  if (!host || !adminPort) {
    return res.status(400).json({ error: 'Missing host or adminPort in request body.' });
  }

  const isServerUp = await checkPortStatus(host, adminPort);

  if (isServerUp) {
    console.log('Server is UP');
    return res.json({ status: ' IBM WEB SPHERE is reachable' });
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
};
