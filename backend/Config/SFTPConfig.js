// SFTPConfig.js

const sftpSettings = {
    host: 'your_sftp_host', // Replace with your SFTP server host
    port: 22, // Default SFTP port is 22
    username: 'your_sftp_username', // Replace with your SFTP username
    password: 'your_sftp_password', // Replace with your SFTP password (if using password-based authentication)
    privateKey: 'path/to/private_key.pem', // Replace with the path to your private key file (if using key-based authentication)
  };
  
  module.exports = sftpSettings;
  