const express=require("express");
const { getproductsBySearch, addproducts, SendOtp, verifyotp, ForgotPass, GetResetpass } = require("../Controller/Allcontrollers")
const router=express.Router()




router 
.post("/products",addproducts)
.get("/search/:keys",getproductsBySearch)
.post("/sendotp",SendOtp)
.post("/verifyotp",verifyotp)
.post("/forgotpassword",ForgotPass)
.get("/reset-password/:id/:token",GetResetpass)










module.exports=router;