import React, { useEffect } from 'react'
import NavBar from "./components/Navbar.jsx"
import {Routes,Route,Navigate} from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import SettingsPage from "./pages/SettingsPage.jsx"
import { useAuthStore } from './store/useAuthStore.js'
import {Toaster} from "react-hot-toast"
import {Loader} from "lucide-react" 
const App = () => {
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore()
  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  console.log({authUser});
  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
  )


  return (
    <div >
      <NavBar/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path='/signup' element={!authUser ?<SignUpPage/> : <Navigate to="/"/>}/>
        <Route path='/login' element={!authUser ?<LoginPage/> : <Navigate to="/"/> }/>
        <Route path='/settings' element={authUser ? <SettingsPage /> : <Navigate to="/login"/>}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App