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

} = require('../Controllers/userController.js')

const { protectSimpleUser,validator,isAdmin }= require('.././Middleware/userMiddleware.js')



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





module.exports = router