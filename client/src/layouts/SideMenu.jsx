import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "../components/ui/sheet"
import { Loader2, MenuIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
  

const SideMenu = () => {


    const { isPending, error, data } = useQuery({
        queryKey: ['userChats'],
        queryFn: () =>
          fetch(`${import.meta.env.VITE_API_URL}/api/userChats`,{
            credentials:"include"
          }).then((res) =>
            res.json(),
          ),
      })
      


  return (
    <Sheet  side="left">
    <SheetTrigger asChild>
        <MenuIcon className='flex sm:hidden' />
    </SheetTrigger>
    <SheetContent side="left" className="bg-[#0e0c16] ">
    <div className='flex flex-col h-screen  p-4'>
        

        <SheetClose asChild>
        <span className='font-semibold text-[20px] mb-[10px]'>Dashboard</span>
        </SheetClose>
        <Link className='p-[10px] text-sm rounded-lg text-gray-400  hover:bg-[#2c2937]' to="/dashboard">Create a New Chat</Link>
        <Link className='p-[10px] text-sm rounded-lg text-gray-400 hover:bg-[#2c2937]' to="/dashboard">Explore Lama AI</Link>
        {/* <Link className='p-[10px] text-sm rounded-lg text-gray-400  hover:bg-[#2c2937]' to="/">Contact</Link> */}
        <hr className='border-none h-[2px] bg-[#ddd] opacity-10 rounded m-[20px]' />

        <span className='font-semibold text-sm mb-[10px]'>RECENT CHATS</span>
        <div className='flex flex-col overflow-auto h-[400px]'>

          {isPending ? <Loader2 className='animate-spin' /> : error ? "Something went wrong" :
            data?.chats?.map((chat)=>(
            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id} className='p-[10px] text-sm rounded-lg text-gray-400  hover:bg-[#2c2937]'>{chat.title}</Link>
          ))}

        </div>
        <hr className='border-none h-[2px] bg-[#ddd] opacity-10 rounded m-[20px]' />

        <div className='mt-auto flex items-center gap-10 text-sm mb-10'>
            <img src='/logo.png' alt='img' className='w-[44px] h-[44px]'/>
            <div className='flex flex-col '>
                <span className='font-bold '>Upgrade to Lama Ai Pro</span>
                <span className='text-gray-400'>Set unlimited access to all features</span>
            </div>
        </div>
    </div>
    </SheetContent>
  </Sheet>
  
  )
}

export default SideMenu