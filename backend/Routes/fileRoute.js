const path = require("path")
const multer = require('multer')

const express = require('express')
const router = express.Router()
const {  checkFTPServerStatus, parseLogFile

} = require('../Controllers/FileZillaController.js')
const { checkCrushFTPServerStatus } = require("../Controllers/CrushFtpController.js")


// FILe ZILLA 

router.get('/checkServer',checkFTPServerStatus),
router.get('/get',parseLogFile),


// Crush ftp
router.get('/checkCrushServer',checkCrushFTPServerStatus),









module.exports = router