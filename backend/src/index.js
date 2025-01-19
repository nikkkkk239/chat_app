// const express = require("express")
import express from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from './routes/message.route.js'
import cors from "cors"
import dotenv from 'dotenv'
import { connectDb } from "./lib/db.js";
import {app,server} from "./lib/socket.js"
import cookieParser from "cookie-parser";
import path from "path"
dotenv.config();
const __dirname = path.resolve();

const PORT = process.env.PORT || 8000

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV == "production" ){
    app.use(express.static(path.join(__dirname , "../frontend/dist")));

    app.get("*" , (req,res)=>{
        res.sendFile(path.join(__dirname , "../frontend" , "dist","index.html"));
    })
}
server.listen(PORT,()=>{
    console.log(`server started at ${PORT}.` );
    connectDb();
})
