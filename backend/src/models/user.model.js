import mongoose, { mongo } from "mongoose";
const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    },profilePic:{
        default:"",
        type:String,
    },
},{timestamps:true})

const User = mongoose.model("user",userSchema)
export default User