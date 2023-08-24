// EmailController.js

const nodemailer = require('nodemailer');
const emailConfig = require('../Config/EmailConfig');
const asynHandler = require("express-async-handler")
const tls = require('tls');

const net = require('net');
const Imap = require('imap');
const { json } = require('express');

// check if the email server is up with sending email
const checkEmailServerStatusSending = asynHandler(async(req,res)=> {
  try {
    // Create a transporter using SMTP transport
    const transporter = nodemailer.createTransport(emailConfig);

    // Define the email options
    const mailOptions = {
      from: emailConfig.senderEmail,
      to: 'eya.amor@esprit.tn', // Replace with the recipient email address
      subject: 'Test Email',
      text: 'This is a test email to check the email server status.',
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    res.json("Server Work Successfully")

    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    res.json("Server Down with error : , ",error)

    return false;
  }
});

// from body
//SMTP
//port : 25
const checkEmailServerStatus = asynHandler(async (req, res) => {
  try {
    const { host, port } = req.body; // Retrieve host and port from the request body

    // Create a TCP socket to connect to the email server's SMTP port
    const socket = new net.Socket();

    // Set a timeout for the connection attempt (in milliseconds)
    const connectionTimeout = 5000; // 5 seconds

    // Attempt to connect to the email server's SMTP port
    const connectionPromise = new Promise((resolve, reject) => {
      socket.connect(port, host, () => {
        // Connection successful
        resolve(true);
      });

      // Handle errors and timeout
      socket.on('error', (error) => {
        reject(error);
      });

      setTimeout(() => {
        reject(new Error('Connection timed out'));
      }, connectionTimeout);
    });

    // Wait for the connection attempt to complete
    const isServerUp = await connectionPromise;

    // Close the socket after the connection attempt
    socket.end();

    console.log('Email server is up', isServerUp);
    res.json("Email server is up");
    return true;
  } catch (error) {
    console.error('Failed to connect to the email server:', error);
    res.json("Failed to connect to the email server:", error);
    return false;
  }
});

// IMAP
//port:  
const checkServerConnection = (host, port) => {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const connectionTimeout = 5000; // 5 seconds

    socket.connect(port, host, () => {
      socket.end(); // Close the socket after the connection attempt
      resolve(true); // Connection successful
    });

    socket.on('error', (error) => {
      socket.destroy(); // Destroy the socket in case of error
      reject(error);
    });

    setTimeout(() => {
      socket.destroy(); // Destroy the socket on timeout
      reject(new Error('Connection timed out'));
    }, connectionTimeout);
  });
};
//IMAP
const checkIMAPServerStatus = asynHandler(async (req, res) => {
  try {
    const { imapHost, imapPort } = req.body; // Retrieve IMAP host/port from the request body

    // Function to check IMAP server connection
    const isIMAPServerUp = await checkServerConnection(imapHost, imapPort);

    console.log('IMAP server is up', isIMAPServerUp);

    res.json({
      imapServer: isIMAPServerUp,
    });
    return true;
  } catch (error) {
    console.error('Failed to connect to IMAP server:', error);
    res.json("Failed to connect to IMAP server:",   error);
    return false;
  }
});

//SMTPS
//port: 465

async function checkSMTPSServerConnection(host, port) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      host: host,
      port: port,
    });

    const connectionTimeout = 5000; // 5 seconds

    socket.on('secureConnect', () => {
      socket.end(); // Close the socket after the connection attempt
      resolve(true); // Connection successful
    });

    socket.on('error', (error) => {
      socket.destroy(); // Destroy the socket in case of error
      reject(error);
    });

    setTimeout(() => {
      socket.destroy(); // Destroy the socket on timeout
      reject(new Error('Connection timed out'));
    }, connectionTimeout);
  });
}

const checkSMTPSServer = asynHandler(async(req,res)=> {

try {
  const { host, port } = req.body; // Retrieve SMTPS host/port from the request body

  // Function to check SMTPS server connection
  const isSMTPSServerUp = await checkSMTPSServerConnection(host, port);

  console.log('SMTPS server is up:', isSMTPSServerUp);

  res.json({
    smtpsServer: isSMTPSServerUp,
  });
} catch (error) {
  console.error('Failed to connect to SMTPS server:', error);
  res.status(500).json({
    error: 'Failed to connect to SMTPS server',
  });
}
});


//host : outlook.office365.com

const sendTestEmailUsingIMAP = async (req, res) => {
  try {
    const { host, port, to } = req.body; // Retrieve IMAP settings from the request body

    // Create a transporter using SMTP transport
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: true, // Use SSL
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    // Define the email options
    const mailOptions = {
      from: user,
      to: to,
      subject: 'Test Email using IMAP',
      text: 'This is a test email sent using IMAP settings.',
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent using IMAP settings:', info.response);
    res.json('Email sent using IMAP settings');
  } catch (error) {
    console.error('Failed to send email using IMAP settings:', error);
    res.status(500).json('Failed to send email using IMAP settings');
  }
};

module.exports = { checkEmailServerStatus,
  checkEmailServerStatusSending,
  checkIMAPServerStatus,
  checkSMTPSServer,
  sendTestEmailUsingIMAP,
 };


