// FTPController.js

const ftpConfig = require('../Config/FTPConfig');
const ftp = require('basic-ftp');
const fs = require('fs');
const xml2js = require('xml2js');


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



const logFilePath = 'C:\\Program Files\\FileZilla Server\\Logs\\filezilla-server.log';
const parseLogFile = async (req,res) => {
  fs.readFile(logFilePath, 'utf-8', (err, logContent) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading log file' });
    }

    console.log(logContent);

    const transfers = {
      STOR: [],
      RETR: [],
    };
    const logLines = logContent.split('\n');

    for (const line of logLines) {
      if (line.includes('STOR')) {
        const fileName = line.match(/STOR (.+)/)[1];
        transfers.STOR.push({ fileName });
      } else if (line.includes('RETR')) {
        const fileName = line.match(/RETR (.+)/)[1];
        transfers.RETR.push({ fileName });
      }
    }


    res.json(transfers);
  });
};



module.exports = { checkFTPServerStatus ,
  parseLogFile

};
