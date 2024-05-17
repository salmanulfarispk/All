const Product = require("../models/Productsschema")






module.exports={
 
  addproducts: async(req,res)=>{

    const {name,description,price,category,stock,imageUrl,}=req.body;
    const newproducts= await Product.create({
      name,
      description,
      price,
      category,
      imageUrl,
      stock
    })    

    res.status(201).json({
      status:"success",
      message:"products created succesfully",
      data:newproducts
    })

},

    //search multiple fields

    getproductsBySearch:async(req,res)=>{
        
        let data=await Product.find(
        {
          "$or":[
            {"name":{$regex:req.params.keys,"$options": "i" }},
            {"category":{$regex:req.params.keys,"$options": "i" }}

          ]
        })

        res.status(200).json(data)

    },

    //otp verification

   SendOtp:async(req,res)=>{
    const { phonenumber } = req.body;
  const newPhoneNumber = "+91" + phonenumber;
  const params = {
    template: 'Your Login OTP is %token',
    timeout: 300
  };

  messagebird.verify.create(newPhoneNumber, params, (err, response) => {
    if (err) {
      
      console.log("OTP Send Error:", err);
      res.status(200).send({ status: "failed", message: "Unable to Send OTP" });
    } else {
      
      console.log("OTP Send Response:", response);
      res.cookie('otpId', response.id, { httpOnly: true, secure: false });
      res.status(200).send({ status: "success", message: "OTP Sent Successfully" });
    }
  
  });
},





}