// const mongoose = require("mongoose");

// const feedbackschema = new mongoose.Schema({
//     college_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "College",
//         required: true,
//     },
//     departments:{
//         type:[String],
//     },
//     days: {
//         type: Number,
//         required: true,
//     },
//     staffs:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Authentication"
//     },
//     sessionname: {
//         type: String,
//     },
//     startdate: {
//         type: Date,
//     },
//     enddate: {
//         type: Date,
//     },
//     feedbackcontent: [
//         {
//             date: {
//                 type: Date,
//                 required: true,
//             },
//             feedbacktype: {
//                 type: String,
//                 enum: ["anonymous", "public"],
//                 required: true,
//             },  
//             records: {
//                 type: Object,
//                 required: true,
//                 validate: {
//                     validator: function (v) {
//                         if (this.feedbacktype === "anonymous") {
//                             return (
//                                 typeof v.rating === "number" &&
//                                 typeof v.description === "string" &&
//                                 !v.name &&
//                                 !v.email
//                             );
//                         } else if (this.feedbacktype === "public") {
//                             return (
//                                 typeof v.name === "string" &&
//                                 typeof v.email === "string" &&
//                                 typeof v.description === "string" &&
//                                 typeof v.rating === "number"
//                             );
//                         }
//                         return false;
//                     },
//                     message: (props) =>
//                         `Invalid feedback structure for feedbacktype "${props.value.feedbacktype}".`,
//                 },
//             },
//         },
//     ],
// });

// const Feedback = mongoose.model("Feedback", feedbackschema);
// module.exports = Feedback;
const mongoose = require("mongoose");

const feedbackschema = new mongoose.Schema({
    college_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
        required: true,
    },
    departments: {
        type: [String],
    },
    days: {
        type: Number,
        required: true,
    },
    staffs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Authentication",
    },
    sessionname: {
        type: String,
    },
    startdate: {
        type: Date,
    },
    enddate: {
        type: Date,
    },
    tutors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutor",
    }],
    status: {
        type: String,
        enum: ["Active", "cancelled","completed"],
        default: "Active",
    },
    link: {
        type: String
    },
    feedbackcontent: [
        {
            date: {
                type: Date,
                required: true,
            },
            feedbacktype: {
                type: String,
                enum: ["private", "public"],
                required: true,
            },
            totalResponses: {
                type: Number,
                default: 0,
            },
            records: [
                {
                    rating: { type: Number, required: true },
                    description: { type: String, required: true },
                    specificTopic: { type: String },
                    department: { type: String },
                    tutor: { type:String},
                    name: { type: String },
                    email: { type: String },
                }
            ],
        },
    ],
});

const Feedback = mongoose.model("Feedback", feedbackschema);
module.exports = Feedback;
