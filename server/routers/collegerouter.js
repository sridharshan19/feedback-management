const express = require("express");
const router = express.Router();
const { addcollege, updatecollege, deletecollege,getColleges } = require("../controllers/college");

router.post("/addcollege", addcollege);
router.post("/updatecollege/:collegeId", updatecollege);
router.post("/deletecollege/:collegeId", deletecollege);
router.get("/getcolleges",getColleges)
module.exports = router;
