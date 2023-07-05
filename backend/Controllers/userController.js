const asynHandler = require("express-async-handler")
const bcrypt = require('bcryptjs')
const User = require('../Models/user.js')
const { generatorOTP ,mailTransport,generateToken } = require('../Utils/mail.js')
const verficationToken = require('../Models/token.js')
const validator = require("email-validator")
const optGenerator = require('otp-generator')

const path = require("path");

const registerUser = asynHandler( async ( req , res )=> {
    const { 
        firstName ,
        lastName , 
        email , 
        password , 
        phone 
    } = req.body
    const  imageUrl =req.file?
    req.file.filename: null;

    if (!firstName || !lastName  || !email || !password ){
        res.json({"message":"Please add  all fields"}).status(400)
            throw new Error('Please add  all fields')
    }
    //verifier user exits by email
    const userExists  =  await User.findOne({email})
    if(userExists){
        res.status(401).send({ message: 'User with this E-mail adress already exists' });
        throw new Error('User with this E-mail adress already exists')
    }
    
    //bcryptjs password cryptage
    const salt = await bcrypt.genSalt(10)
    const headPassword = await bcrypt.hash(password,salt)

    const otp = generatorOTP()

    //create user

    const user = await User.create({
        firstName ,
        lastName ,
        email , 
        imageUrl,
        password: headPassword  , 
        phone,
        role: {name: "userRole"},
        emailToken: otp,  

    })
    if (user) {
      console.log("user created succeffully")
    }

    mailTransport().sendMail({
      from:"zainebhamdi2013@gmail.com",
      to: user.email,
     subject: "One Step To Verify Your Account ",
     html: `
       <html>
         <head>
           <style>
             h1 {
               color: #FFFFFF; 
               text-align: center;
             }
             p {
               color: #444444;
               font-size: 16px;
               text-align: justify;
             }
             a {
               color: #ffffff; 
               background-color: #AB7F42; 
               padding: 12px 24px;
               display: inline-block;
               text-decoration: none;
               border-radius: 4px;
             }
             a:hover {
               background-color: #007bff; 
             }
           </style>
         </head>
         <body>
           <table width="100%" border="0" cellspacing="0" cellpadding="0">
             <tr>
               <td align="center">
                 <img src="cid:logo" alt="Logo" style="max-width: 200px;">
                 <h3 style="color: #444444; font-size: 16px; text-align: justify;">Dear ${user.firstName},</p>
                 <p style="color: #444444; font-size: 16px; text-align: justify;">We are pleased to inform you that your account has been successfully verified.</p>
                 <p style="color: #444444; font-size: 16px; text-align: justify;">Please follow the link below to complete the email verification process:</p>
                     <div style="text-align: center;">
                         <a href="${process.env.CLIENT_URL}/verify-email/${user.emailToken}"  style="color: #FFFFFF; background-color: #F8C471; padding: 12px 24px; display: inline-block; text-decoration: none; border-radius: 4px;">Verify your Email</a>
                     </div>
                 <p style="color: #444444; font-size: 16px; text-align: justify;">Thank you for choosing our services.</p>
                 <p style="color: #444444; font-size: 16px; text-align: justify;">Sincerely,</p>
                 <h3 style="color: #444444; font-size: 16px; text-align: justify;">Vermeg Team</p>
               </td>
             </tr>
           </table>
         </body>
       </html>
     `,
     attachments: [{
       filename: 'logo.png',
       path: path.join(__dirname, '../../public/logo.png'),
       cid: 'logo'
     }]
   });

   if(user){
       res.status(201).json({
           _id: user.id,
           firstName: user.firstName,
           lastName: user.lastName,
           phone: user.phone,
           email: user.email,
           role : user.role,    
           verfication : user.emailToken,
           imageUrl: user.imageUrl,
          
       })
   }
   else{
       res.status(400)
       throw new Error('Invalid user data')
   }

})

const getAllUser = asynHandler(async(req,res)=>{
    
    const user = await User.find( {}).select('-password')
    if (!user) {
        res.Error(404)
        throw new Error(" User Not Found !!")
    }
    res.json(user)

})

const  verifyEmail = asynHandler( async (req,res) => {
  // const emailToken =req.body.emailToken; 
const emailToken = req.params.token; 

// if true = email token is undefined 
// if false = email token is defined
console.log("emailToken is undefined:", !emailToken);

const user = await User.findOne({emailToken});
if (!emailToken.trim()) {
  // email is incorrect
       console.log("Invalid emailToken :", emailToken);
       res.status(400);
       throw new Error("Invalid request");

} else {

              if (!user) {
                res.status(404);
                throw new Error("User Not Found!!");
              }
            
              if (user.verify) {
                res.status(400); 
                throw new Error("User Already Verified!!");
              }
            
              if (!emailToken) {
                  res.status(404)
                  throw  new Error(" Invalid Token !! ")
              }
              if (user) {
              user.emailToken= null;
              user.verify=true;
              console.log(user.email);
            
              await user.save(); 
                  mailTransport().sendMail({
                    from: "zainebhamdi2013@gmail.com",
                    to: user.email,
                    subject: "Account Verified Succeffuly ",
                    html: `
                      <td align="center">
                      
                        <h1 style="color: #AB7F42; text-align: center;"> ${user.lastName} Your Account Is Verified </h1>
                        <h3 style="color: #444444; font-size: 16px; text-align: justify;">Dear ${user.firstName},</p>
                      <p>We are pleased to inform you that your account has been verified. You can now access all the features and services that we offer.</p>
                      <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
                      <p>Best regards,</p>
            
                      <h3 style="color: #444444; font-size: 16px; text-align: justify;">The CARTHAGE CARES Team</p>
                      </td>
                    `
                  }); 
                  

               
                  res.json(user)

}

}
});

const logIn = asynHandler( async (req,res)=>{
  const  { email , password } = req.body
  
  const user = await User.findOne({ email: email });

  if (user &&(await bcrypt.compare(password,user.password) ) ) {
    if(user.emailToken!=null && (user.verify!=true)){
      res.status(400).json({message:'Your email is not verified! Please verify your email'})
    }

      res.json({
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          phone: user.phone,
          role : user.role, 
          verify : user.verify,
          password: user.password, 
          bloque : user.bloque, 
          token: generateToken(user._id)
      })
      
  }else{
      res.status(400).json({message:'Invalid Credentials !'})
      throw new Error('Invalid Credentials !')
  }
})

const bloque = asynHandler( async(req,res)  =>{
  const  { id } =req.body
  const user = await User.findById(id)
  if (user.bloque==false){

       user.bloque=true
       await user.save()
       res.json("User blocked")
       console.log("user is blocked ")
  }
  else {
   res.Error(404)
   throw new Error(" User already blocked !!")
  }
})

module.exports = { 
    registerUser,
    getAllUser,
    verifyEmail,
    logIn,
    bloque
}
