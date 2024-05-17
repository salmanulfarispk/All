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
        {jhjh
          "$or":[
            {"name":{$regex:req.params.keys,"$options": "i" }},
            {"category":{$regex:req.params.keys,"$options": "i" }}

          ]
        })

        res.status(200).json(data)

    },


   





}