const axios = require('axios');
const crushFtpSettings = require('../Config/CrushFTPConfig'); // Path to your CrushFTP configuration

const checkCrushFTPServerStatus = async (req, res) => {
  try {
    const { host, port } = req.body;
    const crushFtpUrl = `http://${host}:${port}`;

    const response = await axios.get(crushFtpUrl);
    if (response.status === 200) {
      console.log('CrushFTP server is up and reachable');
      return res.status(200).json('CrushFTP server is up and reachable');
    } else {
      console.log('CrushFTP server is not responding as expected.');
      return res.status(501).json('CrushFTP server is not responding as expected.');
    }
  } catch (error) {
    console.error('CrushFTP server is down or not reachable:', error.message);
    return res.status(502).json('CrushFTP server is down or not reachable.');
  }
};




module.exports = { checkCrushFTPServerStatus, };

