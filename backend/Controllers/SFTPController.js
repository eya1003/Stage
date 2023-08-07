// SFTPController.js

const sftpConfig = require('../Config/SFTPConfig');
const SftpClient = require('ssh2-sftp-client');

// Function to check if the SFTP server is up
const checkSFTPServerStatus = async () => {
  try {
    const sftp = new SftpClient();

    await sftp.connect(sftpConfig);
    console.log('SFTP server is up and reachable');

    await sftp.end();
    return true;
  } catch (error) {
    console.error('SFTP server is down or not reachable:', error.message);
    return false;
  }
};

module.exports = { checkSFTPServerStatus };
