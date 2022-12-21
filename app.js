import cookieParser from 'cookie-parser';
import express from 'express'
import fileUpload from 'express-fileupload';
import cors from 'cors'
// import multer from 'multer';
import User from './routers/User.js'
 const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors())
// app.use(multer())
app.use(fileUpload({
    limits:{fileSize:50*1024*1024},
    useTempFiles:true
})
)
app.use("/api/v1",User);
 
export default app;
