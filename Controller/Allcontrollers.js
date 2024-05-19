const Product = require("../models/Productsschema")
// const messagebird = require('messagebird')(process.env.MESSAGEBIRD_API_KEY);
const messagebird = require('messagebird');
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const User=require("../models/UserShema")
const Otp=require("../models/otpschema")
const { generateotp } =require("../Helpers/GenerateOTP")
const bcrypt=require("bcrypt");
const { sendMail } = require("../Helpers/sendMail");
const { JWT_SECRET, EMAIL_USER, EMAIL_PASS } = process.env;
const client = messagebird(process.env.MESSAGEBIRD_API_KEY);




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
  
  client.verify.create(newPhoneNumber, params, (err, response) => {
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
  
    client.verify.verify(otpId, otpcode, (err, response) => {
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
      const secret = JWT_SECRET + oldUser.password;  //concatenation of two strings
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
   },

      //rendering a page that for reseting

   GetResetpass:async(req,res)=>{
    const { id, token } = req.params;
  try {
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const verify = jwt.verify(token, secret);
    res.json({ email: verify.email,
       status: "Not Verified" ,
      });

  } catch (error) {
    console.log(error);
    res.json({ status: "Not Verified" });
  }

   },
 
   //password resets here

   postResetedpass:async(req,res)=>{
    const { id, token } = req.params;
    const { password } = req.body;
  
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;

    try {
      const verify = jwt.verify(token, secret);
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        {
          _id: id,
        },  
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
      res.json({ email: verify.email, status: "verified" });

    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
   },

   //otpSend to email

   OtpMail:async(req,res)=>{
     try {
    
      const {email}=req.body;

      const userData=await User.findOne({email});
      if(!userData){
        return res.status(400).json({
          succes:false,
          message: "Email doesnt exists"
        })
      }
       
      if(userData.is_verified == 1){
        return res.status(400).json({
          succes:false,
          message: userData.email +"mail is already verified "
        })
      }

   const g_otp= await generateotp();

   const enter_otp= new  Otp({
    user_id: userData._id,
    otp: g_otp,
   })

   await enter_otp.save();

   const msg = `<p> Hi <b>${userData.fname}</b>, </br> <h4>${g_otp}</h4> </p>`;

    await sendMail(userData.email, "Otp verification ",msg)  //(to,subject,html)

    return res.status(200).json({
      succes:true,
      msg: "Otp has been sends to your mail, plaese check!"
    });
      

     } catch (error) {
      return res.status(400).json({
        success: false,
        msg: error.message,
      })
     }

   },

   //verifying otp send to email

   verify_mailOTP: async(req,res)=>{
    try {

      const {user_id, otp}=req.body;
      const otpData=await Otp.findOne({ user_id,otp })
      if(!otpData){
        res.status(400).json({
          success: false,
          msg: "you entered wrong Otp"
        })
      }
       
      await User.findByIdAndUpdate({_id: user_id},
        {
          $set:{
            is_verified: 1
          }
        }
      );

      return res.status(200).json({
        succes: true,
        msg: "Account verified succesflly"
      })
      
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: error.message,
      })
    }
   },


   






}