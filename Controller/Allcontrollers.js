const Product = require("../models/Productsschema")
const initMB=require('messagebird')
const messagebird = initMB(process.env.MESSAGEBIRD_API_KEY);
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const User=require("../models/UserShema")
const { JWT_SECRET, EMAIL_USER, EMAIL_PASS } = process.env;



         //just try to Learn

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

  //verifyOtp

  verifyotp:async(req,res)=>{
    const { otpcode } = req.body;
    const otpId = req.cookies.otpId; 
  
    if (!otpId) {
      return res.status(400).send({ status: "failed", message: "OTP ID is missing" });
    }
  
    messagebird.verify.verify(otpId, otpcode, (err, response) => {
      if (err) {
        // incorrect OTP
        console.log("OTP Verification Error:", err);
        res.status(200).send({ status: "failed", message: "Invalid OTP" });
      } else {
        console.log("OTP Verification Response:", response);
        res.clearCookie('otpId'); 
        res.status(200).send({ status: "success", message: "Login Success" });
      }
    });
  },

  
    //forgot password using mail

   ForgotPass:async(req,res)=>{
     const {email}=req.body;
     try {
      const oldUser = await User.findOne({ email });
      if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
      }
      const secret = JWT_SECRET + oldUser.password;
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
        expiresIn: "5m",
      });
      const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;  //url that contains the ui of resetting password
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: "Password Reset",
        text: `You requested a password reset. Please click the following link to reset your password: ${link}`,
      };
  
      transporter.sendMail(mailOptions, (error, info)=> {
        if (error) {
          console.log(error);
          return res.status(500).send({ message: 'Error sending email, please try again later.' });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).send({ message: 'Password reset link sent to your email.' });
        }
      });
  
      console.log(link);
      
     } catch (error) {
      console.error(error);
       res.status(500).send({ message: 'Server error, please try again later.' });
     }
   }




}