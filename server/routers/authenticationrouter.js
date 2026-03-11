const express = require("express");
const router = express.Router();
const {adduser,loginuser }=require("../controllers/authenticationcontroller")
router.post("/adduser",adduser);
router.post("/loginuser",loginuser)
module.exports=router;