import { json } from "express";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";

export const signup =async(req,res)=>{
    console.log(req.body);
    const {fullName,email,password} = req.body;
    if(!fullName || !email || !password){
        return res.send(400).json({message:"Data not provided."})
    }
    try {
        if(password.length < 6){
            return res.status(400).json({message:"Passwrod must be at least 6 character."})
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"Email already in use."})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword,
        })
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();

            return res.status(201).json({_id:newUser._id,fullName:newUser.fullName,email:newUser.email,profilePic:newUser.profilePic})
        }else{
            return res.status(400).json({message:"Invalid user data."})
        }
    } catch (error) {
        console.log("Error in signup controller :",error)
        return res.status(500).json({message:'Internal server error . '})
    }
}
export const login =async(req,res)=>{
    const {email,password} = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({message:"All fields are required ."});
        }
    
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found ."})
        }
        const isCorrect = await bcrypt.compare(password,user.password);
        if(!isCorrect){
            return res.status(400).json({message:"Incorrect password ."})
        }
        generateToken(user._id,res);
        return res.status(200).json({_id:user
            ._id,fullName:user
            .fullName,email:user
            .email,profilePic:user
            .profilePic})
    } catch (error) {
        console.log("An error occured in login : ",error);
        return res.status(500).json({message:"An internal server error."})
    }
}
export const logout =async(req,res)=>{
    try {
        res.cookie('jwt',"",{maxAge:0})
        return res.status(200).json({message:"Logged out sccuessful."});

    } catch (error) {
        console.log("error in log out contoller ",error);
        return res.status(500).json({message:"Internal server error . "})
    }   
}
export const updateProfile = async (req,res)=>{
    const {profilePic} = req.body;
    try {
        const userId = req.user._id;
        console.log('user id :',userId);
        console.log("Profile pic : ",profilePic)
        if(!profilePic){
            return res.status(400).json({message:"Profile picture is required . "});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser =  await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile controller , ",error);
        return res.status(500).json({message:"Internal server error ."});
    }
}

export const checkAuth = (req,res)=>{
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in check Auth controller , ",error);
        return res.status(500).json({message:"Internal server error ."});
    }
}