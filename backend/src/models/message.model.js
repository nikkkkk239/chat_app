import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text:{
        type:String,
    },image:{
        type:String,
    },senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true});

const Message = mongoose.model("messages",messageSchema);
export default Message;