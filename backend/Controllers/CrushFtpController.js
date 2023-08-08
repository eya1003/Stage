const axios = require('axios');
const crushFtpSettings = require('../Config/CrushFTPConfig'); // Path to your CrushFTP configuration

const checkCrushFTPServerStatus = async (req,res) => {
  const crushFtpUrl = `http://${crushFtpSettings.host}:${crushFtpSettings.port}`;

  try {
    const response = await axios.get(crushFtpUrl);
    if (response.status === 200) {
        res.json("CrushFTP server is up and reachable")

      console.log('CrushFTP server is up and reachable');
      return true;
    } else {
        res.json("CrushFTP server is not responding as expected.")

      console.log('CrushFTP server is not responding as expected.');
      return false;
    }
  } catch (error) {
    res.json("CrushFTP server is down or not reachable:")

    console.error('CrushFTP server is down or not reachable:');
    return false;
  }
};

const getListFiles = async (req,res) => {
    const crushFtpUrl = `http://${crushFtpSettings.host}:${crushFtpSettings.port}`;
  const webdavEndpoint = '/WebDAV/';
  const directoryPath = 'C:\crushftp'; // Set this to the actual directory path

  try {
    const response = await axios.get(`${crushFtpUrl}${webdavEndpoint}${directoryPath}`, {
      auth: {
        username: crushFtpSettings.user,
        password: crushFtpSettings.password,
      },
    });

    if (response.status === 200) {
      const fileList = response.data; // This will contain the list of files and directories
      console.log('List of files:', fileList);
    } else {
      console.log('Unable to retrieve file list from CrushFTP.');
    }
  } catch (error) {
    console.error('Error while retrieving file list from CrushFTP:', error.message);
  }

}


module.exports = { checkCrushFTPServerStatus, getListFiles};

