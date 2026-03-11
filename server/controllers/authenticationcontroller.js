const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticationModel = require("../models/authentication");


const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key"; 
const adduser = async (req, res) => {
    try {
        const { email, password, role, username } = req.body;

        
        const existingUser = await authenticationModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const newUser = new authenticationModel({
            email,
            password: hashedPassword,
            role,
            username,
        });

        await newUser.save();

        
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role }, 
            SECRET_KEY, 
            { expiresIn: "5h" } 
        );

        
        res.status(201).json({
            message: "User created successfully",
            token, 
            user: { email: newUser.email, role: newUser.role, username: newUser.username }
        });
    } catch (err) {
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
};
const loginuser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authenticationModel.findOne({ email }); // Make sure to use 'await' here
        if (!user) {
            return res.status(401).json({ message: "Authentication failed. User not found." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Use 'user' here instead of 'newUser'
            SECRET_KEY,
            { expiresIn: "5h" }
        );
        res.status(200).json({
            message: "Login successful",
            token: token,
        });
    } catch (err) {
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
};

const updateuser=async(req,res)=>{
    try{

    }
    catch(err){

    }
}

const deleteuser=async(req,res)=>{
    try{
     
    }
    catch(err){

    }
}
module.exports = {adduser,loginuser};
