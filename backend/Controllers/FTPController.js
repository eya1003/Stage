// FTPController.js

const ftpConfig = require('../Config/FTPConfig');
const ftp = require('basic-ftp');

// Function to check if the FTP server is up
const checkFTPServerStatus = async (req,res) => {
  try {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    await client.access(ftpConfig);
    console.log('FTP server is up and reachable');
    res.json("FTP server is up and reachable")
    client.close();
    return true;
  } catch (error) {
    console.error('FTP server is down or not reachable:', error.message);
    res.json("FTP server is down or not reachable")

    return false;
  }
};

module.exports = { checkFTPServerStatus };
