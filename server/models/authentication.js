const mongoose=require("mongoose");
const authenticationschema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","staffs"]
    },
    username:{
        type:String,
        required:true
    }
})
const authentication=mongoose.model("Authentication",authenticationschema);
module.exports=authentication;