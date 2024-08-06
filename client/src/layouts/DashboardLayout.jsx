import { useAuth } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import ChatList from '../components/ChatList'
import { Loader2 } from 'lucide-react'

const DashboardLayout = () => {
    const navigate =useNavigate()
     const {userId, isLoaded} =useAuth()

    useEffect(()=>{
        if(isLoaded && !userId){
            navigate("/sign-in")
        }
    },[isLoaded, userId, navigate])

    if(!isLoaded) return(
      <div className=' w-full flex justify-center items-center h-screen'>
       <Loader2 size={80} className='animate-spin ' />
      </div>
    )

  return (
    <div className='flex gap-[20px] pt-[20px] h-screen'>
        <div className='flex-1 hidden sm:flex'>
        <ChatList />
        </div>
        <div className=' flex-[4] bg-[#12101b] '>
          <Outlet />
          </div>
    </div>
  )
}

export default DashboardLayout