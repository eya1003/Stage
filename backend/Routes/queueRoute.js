const path = require("path")
const multer = require('multer')

const express = require('express')
const router = express.Router()
const {  getQueueMessages, 
    getQueueWithParams,
    getQueueWithParams1,


} = require('../Controllers/RabbitController.js')


const { 
    getQueueWithName,


} = require('../Controllers/IBMWebSphereController.js')
const { protectSimpleUser } = require("../Middleware/userMiddleware.js")

// Rabbit 
router.get('/allQueues',getQueueMessages),
router.get('/getQueue/:qu',protectSimpleUser,getQueueWithParams),
router.get('/getQueue1/:qu',getQueueWithParams1),

// IBM WebSphere
router.get('/getQueueParam/:qu',getQueueWithName),








module.exports = router