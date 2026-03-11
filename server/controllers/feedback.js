const feedbackmodel = require("../models/feedbackschema");
const collegemodel = require("../models/collegeschema");

const addfeedback = async (req, res) => {
  try {
    const { title, college_id, departments, days, tutors, sessionname, startdate, enddate } = req.body;
    console.log(req.body);

    if (!days) {
      return res.status(400).json({ error: 'Days field is missing' });
    }

    const feedback = new feedbackmodel({
      sessionname,
      college_id,
      departments,
      days,
      tutors,
      status: 'Active',
      startdate,
      enddate,
    });

    await feedback.save();

    const feedbackLink = `https://feedback-management-iota.vercel.app/feedbackform/${feedback._id}`;

    feedback.link = feedbackLink;

    await feedback.save();

    res.status(201).json({
      message: 'Feedback added successfully',
      feedbackId: feedback._id,
      link: feedbackLink,
    });
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'An error occurred while adding feedback' });
  }
};


const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackmodel
      .find()
      .populate('college_id', 'collegename') 
      .populate('tutors', 'name'); 
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
const getfeedbackbyid=async(req,res)=>{
  try {
    const { feedbackId } = req.params;
    console.log(feedbackId)
    const feedback = await feedbackmodel.findById(feedbackId)
      .populate('college_id')
      .populate('staffs')
      .populate('tutors');
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    const currentDate = new Date();
    feedback.feedbackcontent.forEach((content) => {
      if (content.feedbacktype === 'anonymous' && currentDate < feedback.enddate) {
        delete content.records.name;
        delete content.records.email;
      }
    });

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error });
  }
}


const updatefeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const updates = req.body;
    console.log(req.body)

    const feedback = await feedbackmodel.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    Object.keys(updates).forEach((key) => {
      feedback[key] = updates[key];
    });

    await feedback.save();
    res.status(200).json({ message: "Feedback updated successfully", feedback });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
const deletefeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const updatedFeedback = await feedbackmodel.findByIdAndUpdate(
      feedbackId,
      { status: "cancelled" },
      { new: true } 
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback marked as inactive successfully", feedback: updatedFeedback });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
const submitFeedback = async (req, res) => {
  const { feedbackId } = req.params;
  const { specificTopic, improvement, rating, feedbackType, name, email, department, tutor } = req.body;

  try {
    const feedbackSession = await feedbackmodel.findById(feedbackId);
    if (!feedbackSession) {
      return res.status(404).json({ error: 'Feedback session not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const sessionEndDate = new Date(feedbackSession.enddate).toISOString().split('T')[0];
    const isLastDay = today === sessionEndDate; 
    const finalFeedbackType = isLastDay ? 'public' : 'private';

    const todayFeedbackIndex = feedbackSession.feedbackcontent.findIndex(
      (feedback) => new Date(feedback.date).toISOString().split('T')[0] === today
    );
console.log("sibsbob")
    const newFeedbackRecord = {
      rating,
      description: improvement,
      specificTopic,
      department,
      tutor,
      ...(finalFeedbackType === 'public' && { name, email })
    };
    console.log("sidssssssssssssssssbsbob")


    if (todayFeedbackIndex !== -1) {
      const existingFeedback = feedbackSession.feedbackcontent[todayFeedbackIndex];
      existingFeedback.records.push(newFeedbackRecord);
      existingFeedback.totalResponses += 1;
    } else {
      feedbackSession.feedbackcontent.push({
        date: new Date(),
        feedbacktype: finalFeedbackType,
        totalResponses: 1,
        records: [newFeedbackRecord],
      });
    }

    await feedbackSession.save();
    
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
};







module.exports = { addfeedback, updatefeedback, deletefeedback, getFeedbacks, getfeedbackbyid, submitFeedback };

