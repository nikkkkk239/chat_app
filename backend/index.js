// const express = require("express")
import express from "express";
import authRoutes from "./src/routes/auth.route.js"
import messageRoutes from './src/routes/message.route.js'
import cors from "cors"
import dotenv from 'dotenv'
import { connectDb } from "./src/lib/db.js";
import {app,server} from "./src/lib/socket.js"
import cookieParser from "cookie-parser";
import path from "path"
dotenv.config();

const PORT = process.env.PORT || 8000

app.use(cors({
    origin:'*',
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
