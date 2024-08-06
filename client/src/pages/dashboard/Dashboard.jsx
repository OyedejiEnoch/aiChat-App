import React from 'react'
import {useAuth} from "@clerk/clerk-react"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const {userId} =useAuth()
  const navigate =useNavigate()

  const queryClient =useQueryClient()

  const mutation = useMutation({
    mutationFn: async(text)=>{
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ text})
      }).then(res=>res.json())
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userChats'] })
      navigate(`/dashboard/chats/${id}`)
    },
  })


  const handleSubmit =async(e)=>{
    
    e.preventDefault()
    const text =e.target.text.value
    if(!text) return;
    mutation.mutate(text)

  
  }


  return (
    <div className='h-screen flex flex-col items-center'>
      <div className='flex-1 flex items-center flex-col justify-center w-[85%] sm:w-[50%] gap-[50px]'>
        <div className=' flex items-center gap-6 opacity-20'>
        <img src='/logo.png' alt='logo' className='w-[74px] h-[74px] ' />
        <h1 className='text-[36px] sm:text-[80px]
            font-bold bg-gradient-to-r from-[#217bfe] via-[#e55571]  bg-clip-text text-transparent'>LAMA AI</h1>
        </div>

        <div className='flex items-center gap-10 justify-center flex-col sm:flex-row'>
          <div className='flex flex-col gap-6 font-[300] text-sm p-6 border border-gray-500 rounded-lg justify-center items-center'>
            <img src='/chat.png' alt='' className='w-[70px] h-[70px] object-cover' />
            <span className='text-center'>Create a New Chat</span>
          </div>
          <div className='flex flex-col gap-6 font-[300] text-sm p-6 border border-gray-500 rounded-lg justify-center items-center'>
            <img src='/image.png' alt='' className='w-[70px] h-[70px] object-cover' />
            <span className='text-center'>Analize My Image</span>
          </div>

          <div className='flex flex-col gap-6 font-[300] text-sm p-6 border border-gray-500 rounded-lg justify-center items-center'>
            <img src='/code.png' alt='' className='w-[70px] h-[70px] object-cover' />
            <span className='text-center'>Help with my code</span>
          </div>
        </div>
      </div>


      <div className='mt-auto w-[50%] bg-[#2c2937] rounded-md flex mb-10'>
        <form onSubmit={handleSubmit} className='w-full h-full flex items-center justify-between gap-6'>
        <input type='text' name='text' placeholder='Ask me anything' className='flex-1 bg-transparent p-6 border-none outline-none 
        text-[#ececec]' />
        <button className='bg-[#605e68] rounded-[50%] cursor-pointer p-[10px] flex items-center mr-[20px]'>
          <img src='/arrow.png' alt="" className='w-[16px] h-[16px]  ' />
        </button>
        </form>
      </div>
    </div>
  )
}

export default Dashboard