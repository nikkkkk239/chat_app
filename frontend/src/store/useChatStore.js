import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";
import { use } from "react";


export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isMessagesLoading : false,
    isUsersLoading : false,

    getUsers:async()=>{
        set({isUsersLoading : true});
        try {
            const res = await axiosInstance.get("messages/users");

            set({users : res.data})
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading : false})
        }
    },
    getMessages:async(userId)=>{
        set({isMessagesLoading : true});
        try {
            const res = await axiosInstance.get(`messages/${userId}`);

            set({messages : res.data})
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading : false})
        }
    },
    sendMessage:async(messageData)=>{
        const {selectedUser,messages} = get()
        try {
            const res = await axiosInstance.post(`messages/send/${selectedUser._id}`,messageData)
            set({messages: [...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    setSelectedUser:(selectedUser)=>set({selectedUser}),
    subscribeToMessages : ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        
        socket.on("newMessage",(data)=>{
            if(selectedUser._id !== data.senderId) return;
            set({messages:[...get().messages,data]})
        })
    },
    unSubscribeFromMessages : ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
}))