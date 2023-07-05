
const routerr = require('express').Router()


routerr.get("/login/success" , (req , res)=>{
    if(req.user){
        res.status(200).json({
            error:false , 
            success: true,
            message: "successfull",
            user: req.user,
            cookies: req.cookies,
            token:req.token
        });
    }else{
        res.status(403).json({
            error:true , 
            message:"Not Authorized",
        });
    }
  
})

routerr.get("/logout",(req , res)=>{
    req.logout(),
    res.redirect('http://localhost:3000/')
})


  module.exports = routerr