import React, {useState} from 'react'
import "./Home.css"
import { Link } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation';


const Home = () => {
    const [typingStatus, setTypingStatus]=useState()

    // const test =async()=>{
    //     await fetch("http://localhost:4000/api/test",{
    //         credentials:"include"
    //     })
    // }

  return (
    <div  className='flex flex-col sm:flex-row items-center gap-16 h-full'>
        <img src='/orbital.png' className='absolute bottom-0 left-0 opacity-5 z-[-1]  ' />
        <div className='flex-1 flex flex-col items-center justify-center gap-4 text-center'>
            <h1 className='text-[44px] sm:text-[80px]
            font-bold bg-gradient-to-r from-[#217bfe] via-[#e55571]  bg-clip-text text-transparent
             '>LAMA AI</h1>
            <h2 className='font-[700]'>SuperCharge your creativity and productivity</h2>
            <h2 className='max-w-[600px] text-gray-300 font-[400] text-sm sm:text-[16px]'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
            </h2>
            <Link to={"/dashboard"} className='px-6 py-4 bg-[#217bfe] rounded-lg text-sm font-semibold
            hover:bg-white hover:text-[#217bfe] transition duration-200'>Get Started</Link>
            {/* <button onClick={test}>Test Api</button> */}
        </div>

        <div className='flex-1 flex items-center justify-center h-full'>
            <div className='relative flex items-center justify-center w-[70%] h-[45%] rounded-xl bg-[#140e2d]'>
                <div className='w-full overflow-hidden absolute top-0 left-0 rounded-xl'>
                    <div className=" bg-img1 opacity-20 w-[200%] h-full bg-cover"></div>
                </div>
                <img src='/bot.png' alt='img' className='w-full object-contain bot' />

                <div className='absolute bottom-[-70px] right-[-50px] flex items-center gap-10 
                p-6 bg-[#2c2937] rounded-lg'>
                <img src={typingStatus === "human1" ? "/human1.jpeg" : typingStatus === "human2" ? 'human2.jpeg' 
                : "bot.png"
                }className='w-[32px] h-[32px] object-cover' />
                <TypeAnimation
                    sequence={[
                     // Same substring at the start will only be typed out once, initially
                    'Use Ai chat for day to day activities',
                    1000, 
                    ()=>{
                        setTypingStatus("bot")
                    },
                    'Ai chat serves as your daily assistance',
                    1000,
                    ()=>{
                        setTypingStatus("human2")
                    },
                    'Utilize the best Ai prompts for effectiveness',
                    1000,()=>{
                        setTypingStatus("bot")
                    },
                    'Personalized Ai chat',
                    1000, ()=>{
                        setTypingStatus("human1")
                    }
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                omitDeletionAnimation={true}
                />
                </div>
            </div>
        </div>

        {/* <div className='absolute bottom-5 left-[50%] translate-x-[-50%] flex flex-col gap-6'>
            <img src='logo.png' className='w-[20px] h-[20px]' />
            <div>
                <Link to={"/"}>Terms Of Service</Link>
                <Link to={"/"}>Privacy of Policy</Link>
            </div>
        </div> */}
    </div>
  )
}

export default Home