import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/feedbackform.css';
import feedbackImg from '../assets/in.jpg';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FeedbackForm() {
  const { id } = useParams();
  const [feedbackData, setFeedbackData] = useState(null);
  const [isToday, setIsToday] = useState(false);
  const [isFeedbackActive, setIsFeedbackActive] = useState(false);
  const[submitted,setissubmitted]=useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specificTopic: '',
    improvement: '',
    rating: 0,
    department: '',
    tutor: ''
  });

  useEffect(() => {
    const checkSubmissionStatus = () => {
      const isSubmitted = localStorage.getItem(`status_${id}`);
      if (isSubmitted) {
        setissubmitted(true); 
      }
    };
  
    checkSubmissionStatus();



    const removeStatusAtMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0); 
  
      const timeUntilMidnight = midnight - now;
  
      setTimeout(() => {
        localStorage.removeItem(`status_${id}`);
      }, timeUntilMidnight);
    };
  
    removeStatusAtMidnight();
  
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/feedback/feedbacks/${id}`);
        console.log("😎😎😎", response.data);
        setFeedbackData(response.data);
  
        const today = new Date().toISOString().split('T')[0];
        const startDate = new Date(response.data.startdate).toISOString().split('T')[0];
        const endDate = new Date(response.data.enddate).toISOString().split('T')[0];
  
        if (today >= startDate && today <= endDate) {
          setIsFeedbackActive(true);
          setIsToday(endDate === today); 
        } else {
          setIsFeedbackActive(false);
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };
  
    fetchFeedback();
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (localStorage.getItem(`status_${id}`)) {
      setissubmitted(true);
      return;
    }
  
    const feedbackType = isToday ? 'public' : 'anonymous';
    const feedbackPayload = {
      specificTopic: formData.specificTopic,
      improvement: formData.improvement,
      rating: formData.rating,
      feedbackType,
      department: formData.department,
      tutor: formData.tutor,
      ...(feedbackType === 'public' && {
        name: formData.name,
        email: formData.email
      })
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/feedback/feedbacks/${id}/submit`, feedbackPayload);

      toast.success('Feedback submitted successfully!');
      localStorage.setItem(`status_${id}`, "submitted");
      setFormData({
        name: '',
        email: '',
        specificTopic: '',
        improvement: '',
        rating: 0,
        department: '',
        tutor: ''
      })
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Error submitting feedback');
    }
  };

  if (!feedbackData) return <div>Loading...</div>;
  if (!isFeedbackActive) return <div>Feedback is not available at this time.</div>;
  if(submitted) return <div>You have already submitted your feedback</div>
  return (
    <div className="feedback-container">
      <div className="feedback-image">
        <img src={feedbackImg} alt="Feedback Illustration" />
      </div>

      <div className="feedback-form">
        <h2>Your feedback fuels the future of learning tomorrow!</h2>
        <form onSubmit={handleSubmit}>
          {isToday && (
            <div className="name-email-group">
              <div className="form-group">
                <label htmlFor="name">Your Name <span>*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Your Email <span>*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="department">Select Department <span>*</span></label>
            <select id="department" name="department" value={formData.department} onChange={handleChange} required>
              <option value="">-- Select Department --</option>
              {feedbackData.departments?.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tutor">Select Tutor <span>*</span></label>
            <select id="tutor" name="tutor" value={formData.tutor} onChange={handleChange} required>
              <option value="">-- Select Tutor --</option>
              {feedbackData.tutors?.map((tutor) => (
                <option key={tutor._id} value={tutor.name}>{tutor.name} - {tutor.specialization}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="specific-topic">Any Specific Topic required during the training <span>*</span></label>
            <textarea
              id="specific-topic"
              name="specificTopic"
              value={formData.specificTopic}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="improvement">Anything to improve?</label>
            <textarea
              id="improvement"
              name="improvement"
              value={formData.improvement}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Submit Feedback
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" />

    </div>
  );
}

export default FeedbackForm;
