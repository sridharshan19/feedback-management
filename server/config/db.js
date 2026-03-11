const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGODB_URI;
function db(){
    mongoose.connect(MONGO_URI)
    .then(()=>console.log("connection successful with mongodb"))
    .catch((err)=>console.log("Error connecting with mongodb",err))
}
module.exports=db;