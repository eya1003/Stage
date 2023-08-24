const path = require("path")

const express = require('express')
const router = express.Router()

const { checkEmailServerStatus,
     checkEmailServerStatusSending, 
     checkIMAPServerStatus,
     checkSMTPSServer,
     sendTestEmailUsingIMAP,
     } 
     = require("../Controllers/EmailController.js");



//host : outlook.office365.com

//smtp

router.post('/checkEmail' ,checkEmailServerStatus)

//imap

router.post('/checkIMAP' ,checkIMAPServerStatus)
router.post('/sendEmailIMAP' ,sendTestEmailUsingIMAP)


//smtps
router.post('/checkSMTPS' ,checkSMTPSServer)









module.exports = router