import React, { useRef } from 'react'
import { IKContext, IKImage, IKUpload } from 'imagekitio-react';

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENFPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC; 


const authenticator =  async () => {

   

    try {
        const response = await fetch('http://localhost:4000/api/upload');

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};


const Upload = ({setImage}) => {
    const onError = err => {
        console.log("Error", err);
      };
      
      const onSuccess = res => {
        console.log("Success", res);
        setImage((preValue)=>({...preValue, isLoading:false, data:res}))
      };
      
      const onUploadProgress = progress => {
        console.log("Progress", progress);
      };
      
      const onUploadStart = (evt) => {
        // console.log("Start", evt);
        const file =evt.target.files[0]

        const reader =new FileReader()
        // setImage((preValue)=>({...preValue, isLoading:true,}))
        reader.onloadend=()=>{
            setImage((preValue)=>({...preValue, isLoading:true, aiData:{
                inlineData:{
                    data: reader.result.split(",")[1],
                    mimeType:file.type
                }
            }
        }));
        }
        reader.readAsDataURL[file]

      };

const isUploadRef =useRef(null)

  return (

    <IKContext
    urlEndpoint={urlEndpoint}
    publicKey={publicKey}
    authenticator={authenticator}
  >
    {/* ...client side upload component goes here */}
    <IKUpload
          fileName="test-upload.png"
          onError={onError}
          onSuccess={onSuccess}
          useUniqueFileName={true}
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
          style={{display:'none'}}
          ref={isUploadRef}
        />

        {<label onClick={()=>isUploadRef.current.click()}>
            <img src='/attachment.png' alt='img' className='w-[20px] h-[20px]' />
        </label>}
  </IKContext>
  )
}

export default Upload