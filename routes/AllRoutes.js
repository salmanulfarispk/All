const express=require("express");
const { getproductsBySearch, addproducts } = require("../controller/Allcontrollers");
const router=express.Router()




router 
.post("/products",addproducts)
.get("/search/:keys",getproductsBySearch)








module.exports=router;