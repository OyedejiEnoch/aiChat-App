
import { useQuery } from '@tanstack/react-query'
import NewPrompt from '../../components/NewPrompt'
import { useLocation, useParams } from 'react-router-dom'
import { IKImage } from 'imagekitio-react'

const ChatPage = () => {
  const params =useParams()
  const path =useLocation().pathname
  const chatId =path.split("/").pop()

  const { isPending, error, data } = useQuery({
    queryKey: ['chatData', chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,{
        credentials:"include"
      }).then((res) =>
        res.json(),
      ),
  })

  // console.log(data._id)


  return (
    <div className='h-[100%] flex flex-col items-center relative'>
      <div className='flex-1 overflow-auto w-full flex justify-center'>
        <div className='w-[80%] sm:w-[60%] flex flex-col gap-6 '>
            
            <div className='p-6'>Test Message from ai</div>

            {isPending? "Loading..." : error ? "Error" :  data.history.map((message)=>(
 
          <>
              {message.img &&
              <IKImage
                  urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENFPOINT}
                  path={message.img}
                  width="300"
                  height={'400'}
                  transformation={[{width:300}]}
                  loading='lazy'
                  lqip={{active:true, quality:20}}
              />
              
              }

            <div className={`p-6 bg-[#2c2937] rounded-lg max-w-[80%] ${message.role === "user" ? "self-end" : ""}`}>
            { message.parts[0].text}
            
            </div>
          </>
            ))}
  

           { data && <NewPrompt chatId={data}/>}
          
        </div>
      </div>
    </div>
  )
}

export default ChatPage