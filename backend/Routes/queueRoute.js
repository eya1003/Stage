const path = require("path")
const multer = require('multer')

const express = require('express')
const router = express.Router()
const {  
    getQueueWithParams,
    getAllMessagesFromQueue,
    getQueueNames,


} = require('../Controllers/RabbitController.js')


const { 
    getQueueWithName, checkServerStatus, getQueueNamesFromWebSphere,


} = require('../Controllers/IBMWebSphereController.js')
const { protectSimpleUser } = require("../Middleware/userMiddleware.js")

// Rabbit 
//router.get('/allMsq',getQueueMessages),
router.get('/getQueue/:qu',getQueueWithParams),
router.get('/getMessages/:qu',getAllMessagesFromQueue),
router.get('/getQueueNames',getQueueNames),

// IBM WebSphere
router.get('/CheckServer',checkServerStatus),
router.get('/getQu',getQueueNamesFromWebSphere),








module.exports = router