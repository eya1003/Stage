// EmailController.js

const nodemailer = require('nodemailer');
const emailConfig = require('../Config/EmailConfig');
const asynHandler = require("express-async-handler")
const net = require('net');

// Function to check if the email server is up with sending email
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



const checkEmailServerStatus = asynHandler(async(req,res)=> {
  try {
    const { host, port } = emailConfig;

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

    console.log('Email server is up:', isServerUp);
    res.json("Email server is up:")
    return true;
  } catch (error) {
    console.error('Failed to connect to email server:', error);
    res.json("Failed to connect to email server:", error)

    return false;
  }
});

module.exports = { checkEmailServerStatus,checkEmailServerStatusSending };


