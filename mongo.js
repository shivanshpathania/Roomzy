const mongoose = require("mongoose");

const connectDB=async ()=>{
    try{
        await mongoose.connect("mongodb+srv://ShivanshPathania:9gyroy9p8@cluster0.tlj0zgz.mongodb.net/")

        console.log("Database Connected");
    } catch(err){
        console.log("Error While Connecting the database",err);
    }
}


module.exports=connectDB;