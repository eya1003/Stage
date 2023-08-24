// FTPController.js

const ftpConfig = require('../Config/FileZillaFTPConfig');
const ftp = require('basic-ftp');
const ftp1 = require('ftp')
const fs = require('fs');


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

module.exports = { checkFTPServerStatus ,
  checkFTPConnection
};
