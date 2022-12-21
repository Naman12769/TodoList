import app from './app.js'
// import mongoose  from 'mongoose';
import connectDatabase from './config/database.js';
import {config} from 'dotenv'
import cloudinary from 'cloudinary'
config({
    path:"./config/config.env"
})
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET
})
connectDatabase();

app.listen(process.env.PORT,()=>{
  console.log("Server is listening on port" +  process.env.PORT)  
})

