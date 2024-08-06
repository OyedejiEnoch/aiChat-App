import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ClerkProvider, SignedIn, UserButton } from '@clerk/clerk-react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { MenuIcon } from 'lucide-react'
import SideMenu from './SideMenu'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const queryClient = new QueryClient()

const RootLayout = () => {

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
     <QueryClientProvider client={queryClient}>
    <div className='flex flex-col py-4 px-4 sm:px-16'>
      <div  className='flex items-center justify-between'>
        <Link to={"/"} className='flex items-center gap-4 font-bold'>
            <img src='/logo.png' alt='img'  className='w-[42px] h-[42px]'/>
            <span className='text-2xl'>Luma Ai</span>
        </Link>

        

    <div className='flex items-center gap-2'>
      <SignedIn>
        <UserButton />
      </SignedIn>

      <SideMenu />
    </div>

      </div>

       <main className=' h-screen overflow-hidden mt-10 sm:mt-2 '>
            <Outlet />
        </main>

    </div>
    </QueryClientProvider>
    </ClerkProvider>
  )
}

export default RootLayout