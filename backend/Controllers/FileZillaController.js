// FTPController.js

const ftpConfig = require('../Config/FileZillaFTPConfig');
const ftp = require('basic-ftp');
const ftp1 = require('ftp')
const fs = require('fs');

const axios = require('axios');

const getFileZilla = async (req, res) => {
  const { host, port, user, password } = req.body;

  const client = new ftp.Client();
  client.ftp.verbose = true; // Set to true if you want to see debug logs

  try {
    await client.access({
      host,
      port,
      user,
      password,
      secure: false, // Set to true if you want to use FTP over TLS
    });

    const list = await client.list('/');
    
    let numFiles = 0;
    let numFolders = 0;

    const fileList = list.map((item) => {
      if (item.isDirectory) {
        numFolders++;
        return `[DIR] ${item.name}`;
      } else {
        numFiles++;
        return `[FILE] ${item.name}`;
      }
    });

    const summary = {
      numFiles,
      numFolders,
    };

    res.status(200).json({ fileList, summary });
  } catch (err) {
    console.error('Error listing files and folders:', err);
    res.status(500).send('Error retrieving files and folders');
  } finally {
    client.close();
  }
};


// Function to check if the FTP server is up
const checkFTPServerStatus = async (req, res) => {
  try {
    const { host, port, user, password } = req.body;  
    const client = new ftp.Client();
    client.ftp.verbose = true;

    const ftpConfig = {
      host: host,
      port: port,
      user: user,
      password: password,
    };

    await client.access(ftpConfig);
    console.log('FTP server is up and reachable');
    res.json("FTP server is up and reachable");
    client.close();
    return true;
  } catch (error) {
    console.error('FTP server is down or not reachable:', error.message);
    res.json("FTP server is down or not reachable");
    return false;
  }
};


const checkFTPConnection = async (req, res) => {
  const { host, port, user, password, folderPath } = req.body;

  if (!host || !port || !user || !password || !folderPath) {
    return res.status(400).json({ message: 'Missing required data' });
  }

  const client = new ftp1();

  client.on('ready', () => {
    client.list(folderPath, (err, list) => {
      if (err) {
        console.error('Error listing directory:', err);
        client.end();
        return res.status(500).json({ message: 'Folder does not exist or connection failed' });
      }

      console.log('Connected to folder on FTP server.');
      res.json({ message: 'Connected to folder on FTP server' });

      client.end();
    });
  });

  client.on('error', (err) => {
    console.error('Error connecting to FTP server:', err);
    res.status(500).json({ message: 'Error connecting to FTP server' });
  });

  client.connect({
    host,
    port,
    user,
    password,
  });
};

const checkFileZillaConfigs = async (req, res) => {
  const configs = req.body; // Assuming req.body is an array of configurations
  const failedConfigs = [];

  for (const config of configs) {
    const { host, port, user, password } = config;

    try {
      // Attempt to connect to the FTP server using the basic-ftp library
      const client = new ftp.Client();
      client.ftp.verbose = true;

      await client.access({
        host,
        port,
        user,
        password,
        secure: false, // Set to true if using FTP over TLS
      });

      // Connection succeeded, close the client
      client.close();
    } catch (error) {
      // Connection failed, add the configuration to the list of failed configs
      failedConfigs.push(config);
    }
  }

  // Send the list of failed configurations in the response
  res.json({ failedConfigs });
};


module.exports = { checkFTPServerStatus ,
  checkFTPConnection,
  checkFileZillaConfigs,
  getFileZilla
};
