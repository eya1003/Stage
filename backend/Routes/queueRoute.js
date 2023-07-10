const path = require("path")
const multer = require('multer')

const express = require('express')
const router = express.Router()
const {  getQueueMessages,


} = require('../Controllers/queueController.js')

router.get('/allQueues',getQueueMessages)




module.exports = router