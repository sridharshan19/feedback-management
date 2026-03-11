const mongoose=require("mongoose");
const collegeschema=new mongoose.Schema({
    collegename:{
        type:String
    },
    availabledepartment:{
   type:[String]
    },
    place:{
        type:String
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    }

})
const college=mongoose.model("College",collegeschema);
module.exports=college;