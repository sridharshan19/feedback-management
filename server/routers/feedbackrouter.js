const express = require("express");
const router = express.Router();
const { addfeedback, updatefeedback, deletefeedback, getFeedbacks,getfeedbackbyid,submitFeedback } = require("../controllers/feedback");

router.post("/addfeedback", addfeedback);
router.get("/feedbacks", getFeedbacks);
router.get("/feedbacks/:feedbackId",getfeedbackbyid);
router.post("/updatefeedback/:feedbackId", updatefeedback);
router.post("/deletefeedback/:feedbackId", deletefeedback);
router.post('/feedbacks/:feedbackId/submit', submitFeedback);

module.exports = router;
