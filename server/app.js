import express from "express"
import mongoose from "mongoose";
import ImageKit from "imagekit";
import dotenv from "dotenv"
import cors from "cors"
import Chat from "./models/chatModel.js";
import UserMainChat from "./models/userChatModel.js";
import {ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node"
import path from "path";
import { urlToHttpOptions } from "url";

dotenv.config()
const app =express()
app.use(express.json())

app.use(cors({
    origin:process.env.FRONT_END_URL,
    credentials:true
}))


const connection =()=>{
  mongoose.connect(process.env.MONGO_DB_URL).then((con)=>{
    console.log("Mongodb connected successfully")
  })
}


const port =process.env.PORT || 4000

const imagekit = new ImageKit({
  // all we need here is our public and secret key
    urlEndpoint:process.env.IMAGE_KIT_ENFPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC,
    privateKey: process.env.IMAGE_KIT_PRIVATE
  });

  app.get('/api/upload', function (req, res) {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
  });


  app.post("/api/chats", 
    
    ClerkExpressRequireAuth(), 
    async (req, res)=>{
    const userId =req.auth.userId
    const { text} = req.body

    try {
      // to create a new chat
      const newChat =new Chat({
        userId:userId,
        history:[{role:"user", parts:[{text}]}]
      })

      const savedChat =  await newChat.save()

      // check if the user already has chats i.e already exist of which chats is an array i.e you have chat1, chat 2, e.t.c

      const userChats =await UserMainChat.find({userId:userId})

      // if there is no chat it means this user is just creating a new chat
      if(!userChats.length){
        const newUserChat = new UserMainChat({
          userId:userId,
          chats:[
            {
              _id:savedChat._id,
              title:text.substring(0, 40)
            }
          ]
        })

        await newUserChat.save()
        res.status(201).send(newChat._id)
      }else{
        // if there is an existing chat of the user, we push to the array of already existing chat
        await UserMainChat.updateOne({userId:userId}, {$push: {
          chats:{
            _id:savedChat._id,
            title:text.substring(0, 40)
          }
        }} )

        res.status(201).send(newChat._id)
      }
      
    } catch (error) {
      console.log(error)
      res.status(500).json("Error creating chat")
    }


  })


  app.get("/api/userChats", ClerkExpressRequireAuth(), async(req, res)=>{
    const userId =req.auth.userId

    try {

      const userChats =await UserMainChat.findOne({userId})

      res.status(200).json(userChats)

    } catch (error) {
      console.log(error)
      res.status(500).send("Error fetching user chats")
    }
  })
  app.get("/api/chats/:id", ClerkExpressRequireAuth(), async(req, res)=>{
    const userId =req.auth.userId

    try {

      const chat =await Chat.findOne({_id:req.params.id, userId})

      res.status(200).json(chat)

    } catch (error) {
      console.log(error)
      res.status(500).send("Error fetching chat")
    }
  })



  app.put("/api/chats/:id", ClerkExpressRequireAuth(), async(req, res)=>{
    const userId =req.auth.userId
    const{question, answer, img}=req.body
   
  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

    try {

      // update one where the chat is of the req.params.id and the userId is of the userId
      const updateChat =await Chat.updateOne({_id:req.params.id, userId},{
        $push:{
          history:{
            $each:newItems
          }
        }
      })

      res.status(200).send(updateChat)

    } catch (error) {
      console.log(error)
      res.status(500).send("Error adding message")
    }
  })

  // app.get("/api/test", ClerkExpressRequireAuth(), (req, res,)=>{
  //   const userId =req.auth.userId
  //   console.log(userId)
  //   console.log("Successful")
  //   res.send("Success")
  // })

  app.use((err, req, res, next)=>{
    console.log(err.stack)
    res.status(401).send("unAuthencticated")
  })

app.listen(port, (req, res)=>{
    connection()
    console.log(`Server started at port ${port}`)
})


