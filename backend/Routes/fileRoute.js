const path = require("path")
const multer = require('multer')

const express = require('express')
const router = express.Router()
const {  checkFTPServerStatus, parseLogFile

} = require('../Controllers/FTPController.js')


// FILe ZILLA 

router.get('/checkServer',checkFTPServerStatus),
router.get('/get',parseLogFile),









module.exports = router