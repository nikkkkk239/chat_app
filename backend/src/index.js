// const express = require("express")
import express from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from './routes/message.route.js'
import cors from "cors"
import dotenv from 'dotenv'
import { connectDb } from "./lib/db.js";
import {app,server} from "./lib/socket.js"
import cookieParser from "cookie-parser";
dotenv.config();

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
server.listen(PORT,()=>{
    console.log(`server started at ${PORT}.` );
    connectDb();
})
