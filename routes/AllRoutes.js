const express=require("express");
const { getproductsBySearch, addproducts, SendOtp, verifyotp, ForgotPass } = require("../Controller/Allcontrollers")
const router=express.Router()




router 
.post("/products",addproducts)
.get("/search/:keys",getproductsBySearch)
.post("/sendotp",SendOtp)
.post("/verifyotp",verifyotp)
.post("/forgotpassword",ForgotPass)









module.exports=router;