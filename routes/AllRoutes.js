const express=require("express");
const { getproductsBySearch, addproducts, SendOtp, verifyotp,
     ForgotPass, GetResetpass, postResetedpass, OtpMail } = require("../Controller/Allcontrollers")
const router=express.Router()




router 
.post("/products",addproducts)
.get("/search/:keys",getproductsBySearch) 

//send otp to mobilenumber
.post("/sendotp",SendOtp)
.post("/verifyotp",verifyotp)

//send otp to email
.post("/send-otp",OtpMail)



  //reset password through mail
.post("/forgotpassword",ForgotPass)  //This route is used when a user forgets their password and requests a password reset.
.get("/reset-password/:id/:token",GetResetpass)  //This route is used to render a page or form where the user can reset their password.
.post("/reset-password/:id/:token",postResetedpass) //This route is used to handle the submission of the new password during the password reset process.











module.exports=router;