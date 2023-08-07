const asynHandler = require("express-async-handler")
const bcrypt = require('bcryptjs')
const User = require('../Models/user.js')
const { generatorOTP ,mailTransport,generateToken } = require('../Utils/mail.js')
const verficationToken = require('../Models/token.js')
const validator = require("email-validator")
const optGenerator = require('otp-generator')
const fs = require('fs')
const handlebars = require('handlebars');
const util = require('util');


const path = require("path");



const findUserById = asynHandler(async(req,res)=>{
  const { id } = req.params
  const user = await User.findById( id ).select('-password')
  if (!user) {
    res.status(420);

      throw new Error(" User Not Found !!")
  }
  res.json(user)

})

const getAllUser = asynHandler(async(req,res)=>{
    
  const user = await User.find( {}).select('-password')
  if (!user) {
    res.status(430);

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
          
                res.json(user)

}

}
});


const Unbloque = asynHandler( async(req,res)  =>{
  const  { id } =req.body
  const user = await User.findById(id)
  if (user.bloque==true){

       user.bloque=false
       await user.save()
       res.json("User Unbloqued")
       console.log("user is Unblocked ")
  }
  else {
   res.Error(404)
   throw new Error(" User already Unblocked !!")
  }
})

const logIn = asynHandler( async (req,res)=>{
const  { email , password } = req.body

const user = await User.findOne({ email: email });
if (!user) {
  res.status(400).json({message:'Please Sign up!'})
} else if ( (user.verify!=true)){
  res.status(400).json({message:'Your email is not verified! Please verify your email'})
} if(user.emailToken!=null) {
  res.status(400).json({message:'Please Reset your password'})

}
if(user.bloque==true) {
  res.status(400).json({message:'This user is blocked'})

}else if (user &&(await bcrypt.compare(password,user.password) ) ) {


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
    console.log("login with success")
} 
 

else {
    res.status(400).json({message:'Password is incorrect !'})
    throw new Error('Invalid Credentials !')
}
})
const bloque = asynHandler(async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (user.bloque==false) {
    user.bloque = true;
    await user.save();
    res.json("User blocked");
    console.log("User is blocked");
  } else {
    res.status(400).json({ error: "User already blocked" });
  }
});



const updateUser = asynHandler(async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;
  let imageUrl; // Declare imageUrl variable
  const user = await User.findById(req.params.id);

  // Check if a file was uploaded
  if (req.file) {
    imageUrl = req.file.filename;
  } else {
    // If no file was uploaded, use the existing imageUrl from the user
    imageUrl = user.imageUrl;
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.imageUrl = imageUrl || user.imageUrl;
      if (validator.validate(email)) {
        user.email = email; 
      } else {
        user.email = user.email;
      }
      user.password = hashedPassword || user.password;
    }
  } else {
    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.imageUrl = imageUrl || user.imageUrl;
      if (validator.validate(email)) {
        user.email = email;
      } else {
        user.email = user.email;
      }
    }
  }

  const updatedUser = await user.save();
  console.log("user updated")
  res.json({
    _id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    imageUrl: updatedUser.imageUrl,
    email: updatedUser.email,
    password: updatedUser.password,
  });
});

const forgetPass = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ "message": 'Invalid email' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ "message": "Invalid User" });
    }

    const otp = optGenerator.generate(10, { specialChars: false });
    user.emailToken = otp;
    await user.save();

    console.log("OTP:", otp);
    console.log("================================");

    fs.readFile('backend\\Utils\\Template\\context.html', { encoding: 'utf-8' }, function (err, html) {
      if (err) {
        console.log(err);
      } else {
        console.log("OTP for Email:", otp);
        var template = handlebars.compile(html);
        var replacements = {
          name: user.lastName + " " + user.firstName,
          action_url: `http://localhost:3000/reset-password/${otp}`,
        };
        var htmlToSend = template(replacements);


        mailTransport().sendMail({
          from:"zainebhamdi2013@gmail.com",
          to: user.email,
          subject: "Rest Password Mail",
          html: htmlToSend
      })       
      }
    });

    return res.json("done");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ "message": "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {

  const emailToken = req.params.token; 
  const { email } = req.body;
  const { newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ "message": 'Email and newPassword are required in the request body' });
  }
  const user = await User.findOne({emailToken});
if (!emailToken.trim()) {
// email is incorrect
     console.log("Invalid emailToken :", emailToken);
     res.status(400).json({ "message": 'Problem in generate Token' });
     ;
     throw new Error("Invalid request");

} else {

  try {

    if (!user) {
      return res.status(404).json({ "message": "User not found" });
    }

    // Reset the user's password here

    const salt = await bcrypt.genSalt(10)
    const headPassword = await bcrypt.hash(newPassword,salt)
    user.password = headPassword;
    user.emailToken = null;

    await user.save();   
     console.log("Password reset successful");


    return res.json({ "message": "Password reset successful" });
    console.log("Password reset successful");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ "message": "Internal Server Error" });
  }
}
};




const registerUser = asynHandler( async ( req , res )=> {
  const { 
      firstName ,
      lastName , 
      email , 
      password 
  } = req.body
  const  imageUrl =req.file?
  req.file.filename: null;

  if (!firstName  || !email || !password ){
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
      role: {name: "userRole"},
      emailToken: otp,  
      })
  if (user) {
    console.log("user created succeffully")
        /*
      fs.readFile('backend\\Utils\\Template\\email.html', {encoding: 'utf-8'}, function (err, html) {
        if (err) {
          console.log(err);
        } else {
            console.log(otp)
            var template = handlebars.compile(html);
            var replacements = {
                name: user.lastName+" "+user.firstName,
                action_url: `${process.env.CLIENT_URL}/verify-email/${user.emailToken}`,     
            };
            var htmlToSend = template(replacements);
    mailTransport().sendMail({
        from:"zainebhamdi2013@gmail.com",
        to: user.email,
        subject: "One Step To Verify Your Account",
        html: htmlToSend
    })}})
    */
  }


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

        
});

module.exports = { 
    registerUser,
    getAllUser,
    verifyEmail,
    logIn,
    bloque,
    findUserById,
    updateUser,
    forgetPass,
    resetPassword ,
    Unbloque
}
