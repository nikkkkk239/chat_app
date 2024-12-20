import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import axios from "axios"
import { io } from "socket.io-client"


export const useAuthStore = create((set,get)=>({
    authUser : null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    isCheckingAuth:true,
    onlineUsers : [],
    socket : null,

    checkAuth:async()=>{
        try {
            const res = await axiosInstance.get("/auth/check")

            set({authUser:res.data})
            get().connectSocket();

        } catch (error) {
            console.log("Error in useAuthStore : ",error);
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    }  ,
    signup:async (data)=>{
        set({isSigningUp : true});
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser : res.data})
            toast.success("Account created successfully . ");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({isSigningUp : false});
        }
    } ,
    login : async(data)=>{
        set({isLoggingIn : true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser : res.data});
            toast.success("Account Logged in successfully.")
            get().connectSocket()

        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn : false})
        }
    },
    logout:async()=>{
        try {
            const res = await axiosInstance.post("/auth/logout");
            set({authUser : null})
            toast.success("Account logged out successfully .")
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    updateProfile : async(data)=>{
        set({isUpdatingProfile : true})
        try {
            console.log("Data from updateprofile component : ",data)
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({autUser : res.data});
            toast.success("Profile Picture updated successfully.")
        } catch (error) {
            console.log("Error occured in update profile",error);
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile : false})
        }
    },
    connectSocket : ()=>{
        const {authUser} = get();
        if( !authUser || get.socket?.connected) return ;
        const socket = io("http://localhost:5001",{
            query:{userId:authUser._id},
        })
        socket.connect();
        set({socket:socket})

        socket.on("getOnlineUsers",(data)=>{
            set({onlineUsers : data})
        })
        
    },
    disconnectSocket : ()=>{
        if(get().socket?.connected) get().socket?.disconnect()
    }
}))