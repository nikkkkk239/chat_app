import axios from "axios"
import { useAuthStore } from "../store/useAuthStore.js"

export const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api`,
})

// Attach Authorization header from the auth store for every request
axiosInstance.interceptors.request.use((config) => {
    try {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (err) {
        // ignore
    }
    return config;
}, (error) => Promise.reject(error));