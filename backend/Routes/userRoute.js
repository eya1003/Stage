const path = require("path")
const multer = require('multer')
const { v4 : uuid4 } = require('uuid');

const express = require('express')
const router = express.Router()
const {
    registerUser,
    getAllUser,
    verifyEmail,
    logIn,
    bloque,
    findUserById,
    updateUser,
    forgetPass,
    resetPassword,
    Unbloque,

} = require('../Controllers/userController.js')

const { protectSimpleUser,validator,isAdmin }= require('.././Middleware/userMiddleware.js');
const { checkEmailServerStatus, checkEmailServerStatusSending } = require("../Controllers/EmailController.js");
const { reset } = require("nodemon");



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, '../../frontend/public/images')); // use absolute path for uploaded files
  },
    filename: function(req, file, cb) {
      cb(null, uuid4()+ '-' + Date.now() + path.extname(file.originalname)); // specify the file name
    }
  });
  
  const fileFilter = (req,file,cb) =>{
    const allowedFileTypes = ['image/jpeg' , 'image/jpg' , 'image/png'];
    if(allowedFileTypes.includes(file.mimetype))
    {
        cb(null,true);
    } else {
        cb(null, false);
    }
  }
  // Create a new Multer upload instance
  let upload = multer({ storage, fileFilter});

router.post('/register',upload.single('imageUrl') ,registerUser)
router.get('/allUser',getAllUser)
router.put('/verifyEmail/:token',verifyEmail)
router.post('/login',logIn)
router.put('/block',bloque)
router.put('/Unblock',Unbloque)
router.get('/getuser/:id',protectSimpleUser,findUserById)
router.post('/email' ,checkEmailServerStatusSending)
router.get('/checkEmail' ,checkEmailServerStatus)
router.post('/forget-password',forgetPass)
router.put('/reset-password/:token',resetPassword)

router.put('/updateUser/:id',upload.single('imageUrl'),updateUser)





module.exports = router