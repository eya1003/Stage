const path = require("path")
const multer = require('multer')

const express = require('express')
const router = express.Router()
const {  checkFTPServerStatus, checkFTPConnection, checkFileZillaConfigs, getFileZilla

} = require('../Controllers/FileZillaController.js')
const { checkCrushFTPServerStatus,  } = require("../Controllers/CrushFtpController.js")


// FILe ZILLA 
router.post('/checkServer',checkFTPServerStatus),
router.post('/checkExist',checkFTPConnection),
router.post('/checkAllConfig',checkFileZillaConfigs),
router.post('/getFile',getFileZilla),


// Crush ftp
router.post('/checkCrushServer',checkCrushFTPServerStatus),









module.exports = router