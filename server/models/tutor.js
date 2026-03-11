const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  college: { type: String },
  status:{
    type:String,
    enum:['active','inactive'],
    default:"active"
  }
});

const Tutor = mongoose.model('Tutor', tutorSchema);

module.exports = Tutor;
