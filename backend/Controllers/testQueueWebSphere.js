const express = require('express');
const axios = require('axios');
const https = require('https');

const app = express();

const baseUrl = 'http://localhost:9060/ibm/console/';
const loginUrl = `${baseUrl}j_security_check`;
const queueBaseUrl = `${baseUrl}rest/messaging/`;

const loginData = 'j_username=&j_password=';
const loginConfig = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

const getQueueNamesFromWebSphere = async () => {
  try {
    // Log in to get the session cookie
    const loginResponse = await axios.post(loginUrl, loginData, loginConfig);

    // Use the session cookie to get the list of queues
    const queueConfig = {
      headers: { Cookie: loginResponse.headers['set-cookie'] },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };

    const queuesResponse = await axios.get(queueBaseUrl, queueConfig);

    // Extract queue names from the response
    const queueNames = queuesResponse.data.map((queue) => queue.name);

    return queueNames;
  } catch (error) {
    console.error('Error occurred:', error.message);
    return [];
  }
};


module.exports = {
    getQueueNamesFromWebSphere
  };