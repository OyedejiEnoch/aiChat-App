import React, { useEffect, useRef, useState } from 'react'
import Upload from './Upload'
import { IKImage } from 'imagekitio-react'
import model from '../lib/gemini'
import Markdown from 'markdown-to-jsx'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

const NewPrompt = ({chatId}) => {

  const [question, setQuestion]=useState()
  const [answer, setAnswer] =useState()
  // const [role, setRole]=useState()
  // const [parts, setParts]=useState()

  const [image, setImage]=useState({
    isLoading:false,
    error:"",
    data:{},
    aiData:{}
  })

  console.log(chatId.history)

  // const getHistory =()=>{
  //   chatId?.history.map((history)=>(
  //     setRole(history.role),
  //     setParts( [{ text: history?.parts[0].text }])
  //   ))
  // }
  // getHistory()  

  // console.log(role, parts)

  const chat = model.startChat({
    history: [
      chatId?.history.map(({ role, parts }) => ({
        role,
        parts: [{ text: parts[0].text }],
      })),
    ],
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  // const chat = model.startChat({
  //   history: [
  //     {
  //       role: "user",
  //       parts: [{ text: "Hello, I have 2 dogs in my house." }],
  //     },
  //     {
  //       role: "model",
  //       parts: [{ text: "Great to meet you. What would you like to know?" }],
  //     },
  //   ],
  //   generationConfig: {
  //     maxOutputTokens: 100,
  //   },
  // });

  console.log(chatId?._id)
  const endRef =useRef(null)
  const formRef =useRef(null)

  const queryClient =useQueryClient()

  const mutation = useMutation({
    mutationFn: async()=>{
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId._id}`, {
        method:"PUT",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ question: question.length ? question : undefined,
          answer,
          img: image.aiData?.filePath || undefined
        })
      }).then(res=>res.json())

      
    },
    onSuccess: (id) => {
      console.log("Triggered")
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['chatData', chatId?._id] }).then((res)=>(
        formRef.current.reset(),
        setAnswer(""),
        setQuestion(""),
        setImage({
          isLoading:false,
          error:"",
          data:{},
          aiData:{}
        })
      ))
      
    },
    onError:(err)=>{
      console.log(err)
    }
  })


    useEffect(()=>{
      endRef.current.scrollIntoView({behaviour:"smooth"})
    },[chatId,answer, question, image.data.filePath])


  const add =async(text, isInitial)=>{
   if(!isInitial) setQuestion(text)
    try {
      const result = await chat.sendMessageStream(Object.entries(image.aiData).length ? [image.aiData, text] :  [text]);
      let acumulatedText = '';
      for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
      acumulatedText += chunkText;
      setAnswer(acumulatedText);
    }

    mutation.mutate()
    } catch (error) {
      console.log(error)
    }    
   
    // console.log(response.text())
    // console.log(text);
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()

    const text =e.target.text.value;

    if(!text) return;

    add(text, false)
  }


  // in production we don't want it to run twice

  const hasRun =useRef(false)
  useEffect(()=>{
    if(!hasRun.current){
      if(chatId.history?.length === 1){
        add(chatId.history[0].parts[0].text, true)
      }
    }
    hasRun.current = true
})
  
  return (
    < >
        {/* Add new chat */}
        {image.isLoading && <div><Loader2 className='animate-spin' /></div>}
        {image.data?.filePath && (
          <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENFPOINT}
            path={image.data.filePath}
            width="300"
            transformation={[{width:300}]}
            />
        )}

        {question && 
        <div className='p-6 bg-[#2c2937] rounded-lg max-w-[80%] self-end'>
          {question}
        </div>
        }
        {answer && 
        <div className='p-6'>
        <Markdown>{answer}</Markdown>
        </div>
        }

        <div className='pb-24'  ref={endRef} />


        <form onSubmit={handleSubmit} className=' w-[70%] sm:w-[60%] bg-[#2c2937] rounded-xl absolute bottom-0 px-5 gap-6 flex items-center'
        ref={formRef}>
          <Upload setImage={setImage} />
            <input id='file'  type='file' multiple={false} hidden  />

            <input type='text' name='text' placeholder='Ask anything...' className='flex-1 p-6 border-none outline-none bg-transparent text-[#ececec]' />

            <button className='rounded-xl bg-[#605e68] border-none p-2 flex items-center justify-center'>
                <img src='/arrow.png' alt='img' className='cursor-pointer w-[16px] h-[16px]' />
            </button>
        </form>
    </>
  )
}

export default NewPrompt