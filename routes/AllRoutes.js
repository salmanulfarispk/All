const express=require("express");
const { getproductsBySearch, addproducts, SendOtp, verifyotp } = require("../Controller/Allcontrollers")
const router=express.Router()




router 
.post("/products",addproducts)
.get("/search/:keys",getproductsBySearch)
.post("/sendotp",SendOtp)
.post("/verifyotp",verifyotp)









module.exports=router;