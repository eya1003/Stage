// ftpController.js

const fs = require('fs');
const path = require('path');
const Client = require('ftp');
const ftpConfig = require('../Config/FTPConfig'); // Import the FTP configuration object

function ftpTransferAndCheck(localFilePath, remoteFilePath, callback) {
  const client = new Client();

  client.on('ready', () => {
    console.log('Connected to FTP server');

    // Perform the file transfer
    client.put(localFilePath, remoteFilePath, (err) => {
      if (err) {
        client.end();
        return callback(err);
      }

      console.log('File transfer successful');

      // Here, you can add code to verify the configuration of the devices.
      // Depending on your use case, you might need to SSH into the devices
      // or use other methods to check if they are configured correctly.

      // For demonstration purposes, let's assume the configuration check was successful.
      const configurationCheckPassed = true;

      client.end();
      return callback(null, configurationCheckPassed);
    });
  });

  client.on('error', (err) => {
    console.error('FTP error:', err);
    return callback(err);
  });

  // Connect to the FTP server using the provided configuration
  client.connect(ftpConfig);
}

module.exports = ftpTransferAndCheck;
