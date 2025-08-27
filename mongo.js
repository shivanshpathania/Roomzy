const mongoose = require("mongoose");

const connectDB=async ()=>{
    try{
        await mongoose.connect("mongodb+srv://shashankchauhan134:vjEAF13M21c0UltF@cluster0.f8itg.mongodb.net/HotelBookingApp?retryWrites=true&w=majority&appName=Cluster0")

        console.log("Database Connected");
    } catch(err){
        console.log("Error While Connecting the database",err);
    }
}


module.exports=connectDB;