const express=require("express")
const app=express();
const dotenv=require("dotenv").config();
const mongoose=require("mongoose")
const userRoute=require("./routes/AllRoutes")
port=5002


const MongoDb="mongodb://127.0.0.1:27017/NewLearnings";
main().catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MongoDb)
    console.log("Db connected");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
     
app.use("/api/user/",userRoute)

app.listen(port,()=>{
    console.log("port running ",port);
})