const path = require("path")
const multer = require('multer')

const express = require('express')
const router = express.Router()
const {  
    getQueueWithParams,
    getAllMessagesFromQueue,
    getQueueCount,
    checkEmptyQueues,
    checkQueueExistence,
    sendMessageWithDeadLetter,
    getQueuesWithDLXInfo,
    sendMessageWithTTL,
    sendUnroutableMessages,
    checkUnroutableQueues,
    processQueueInformation,
    testRabbitMQServer,


} = require('../Controllers/RabbitController.js')


const {  checkServerStatus,


} = require('../Controllers/IBMWebSphereController.js')
const { protectSimpleUser } = require("../Middleware/userMiddleware.js")

// config local in code 

            // Rabbit 
            //router.get('/allMsq',getQueueMessages),
            router.get('/getQueue/:qu',getQueueWithParams),
            router.get('/getMessages/:qu',getAllMessagesFromQueue),

            // IBM WebSphere
            router.post('/CheckServer',checkServerStatus),

// config from body 
router.post('/getFromBody',getQueueCount),
router.post('/checkEmpty',checkEmptyQueues),
router.post('/checkExist',checkQueueExistence),
router.post('/send',sendMessageWithDeadLetter),
router.get('/getDLX',getQueuesWithDLXInfo),
router.post('/sendTTL',sendMessageWithTTL),
router.post('/sendUnroutable',sendUnroutableMessages),
router.post('/whyyy',testRabbitMQServer),
router.get('/checkUnroutable',checkUnroutableQueues),


router.get('/checkAll',processQueueInformation),



module.exports = router