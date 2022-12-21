import { DATE } from "mysql/lib/protocol/constants/types.js";
import User from "../models/User.js"
import { sendMail } from "../Utils/sendMail.js";
import sendToken from "../Utils/sendToken.js";
import cloudinary from 'cloudinary'
import fs from 'fs'

 export const register=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        const{avatar}=req.file
        // console.log(avatar)
      
        let user=await User.findOne({email})
        if(user){
            return res.status(400).json({
                success:false,
                error:"USer already exist"
            })
        }
        const otp=Math.floor(Math.random()*100000)
        const mycloud=await cloudinary.v2.uploader.upload(avatar,{
            folder:"todoapp"
        })
        fs.rmSync("./Utils/Screenshot",{recursive:true})

        user =await User.create({name,email,password,avatar:{public_id:mycloud,url:mycloud.secure_url},otp,otp_expiry:new Date(Date.now()+process.env.OTP_EXPIRY*60*1000)})
        await sendMail(email,"verify your account",`your otp is ${otp}`)
         sendToken(res,user,200,"otp send successfully on email, please verify your account")
        res.send("ok")
    } catch (error) {
        res.status(500).json({
            error:error.message
            
        })
    }
}
// export default register

export const verify=async(req,res)=>{
    try {
        const otp=Number(req.body.otp);
        const user=await User.findById(req.user._id);
if(user.otp !=otp || user.otp_expiry <Date.now()){
    return res.status(500).json({
        success:false,
        message:'invalid otp or has been expired'
    })
}
user.verified=true
user.otp=null
user.otp_expiry=null
await user.save()
sendToken(res,user,200,"Account verified")

    } catch(error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}
export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"please enter all fields"
            })
        }
        
        const user=await User.findOne({email}).select("+password")
        if(!user){
            return res.status(400).json({
                success:false,
                error:"invalid email or password"
            })
        }
        const isMatch=await user.comparePassword(password);

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"invalid password"
            })
        }
        sendToken(res,user,200,"login successfully")

      

    } catch (error) {
        res.status(500).json({
            error:error.message
            
        })
    }
}
export const logout=async(req,res)=>{
    try {
       res.status(200).cookie("token",null,{expires:new Date(Date.now())}).json({
        success:true,
        message:"logout successfully"

       })
    } catch (error) {
        res.status(500).json({
            error:error.message
            
        })
    }
}

export const addTask=async(req,res)=>{
    try {
        const{title,description}=req.body;
        const user=await User.findById(req.user._id);
        user.tasks.push({title,description,completed:false,createdAt:new Date(Date.now())})
        user.save()

        res.status(200).json({
            success:true,
            message:"Task added successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const removeTask=async(req,res)=>{
    try {
        const{taskId}=req.params;
        const user=await User.findById(req.user._id);
        user.tasks=user.tasks.filter(task=>task._id !==taskId);
        user.save()

        res.status(200).json({
            success:true,
            message:"Task removed successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const updateTask=async(req,res)=>{
    try {
        const{taskId}=req.params;
        const user=await User.findById(req.user._id);
        user.tasks=user.tasks.find(task=>task._id.toString() ==taskId.toString());
        user.tasks.completed= !user.tasks.completed
        user.save()

        res.status(200).json({
            success:true,
            message:"Task updaed successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const getMyProfile=async(req,res)=>{
    try {
        
        const user=await User.findById(req.user._id);
    
    sendToken(res,user,201,`welcome back ${user.name}`)
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const updateProfile=async(req,res)=>{
    try {
        
        const user=await User.findById(req.user._id);
        const {name}=req.body
        const{avatar}=req.file
        if(name){
            user.name=name
        }
        if(avatar){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            const mycloud=await cloudinary.v2.uploader.upload(avatar)
            fs.rmSync('./Utils/Screenshots',{recursive:true})
            user.avatar={
                public_id:mycloud.public_id,
                url:mycloud.secure_url

            }
        }
        res.status(200).json({
            success:true,
            mesage:"profile updated successfully"
        })
    
    
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const updatePassword=async(req,res)=>{
    try {
        
        const user=await User.findById(req.user._id);
        const {oldPassword,newPassword}=req.body

        if(!oldPassword || newPassword){
            return res.status(400).json({
                success:false,
                message:"please enter all field"
            })
        }
        // const{avtar}=req.files
        const isMatch=await User.comparePassword(oldPassword);
        if(!isMatch){
            return   res.status(400).json({
                success:false,
                mesage:"invalid old password"
            })
        }
        user.password=newPassword
        await user.save()
        res.status(200).json({
            success:true,
            message:"password updated successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const forgotPassword=async(req,res)=>{
    try {
        
        const {email}=req.body
        const user =await User.findOne({email})

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid email"
            })
        }
        const otp=Math.floor(Math.random()*100000);
        user.resetPasswordOtpExpiry=Date.now()+10*60*1000
        await user.save()
        user.resetPasswordOtp=otp;
        const message=`your otp for resetting the password ${otp}. if you did not request for this, please ignore this email`
        await sendMail(email,`Request for reset password"`,message);
        res.status(200).json({
            success:true,
            message:`otp sent on ${email}`
        })
        // const{avtar}=req.files

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const resetPassword=async (req,res)=>{
    try {
        const {otp,newPassword}=req.body;
        const user=await User.findOne({
            resetPasswordOtp:otp,
            resetPasswordOtpExpiry:{$gt:Date.now()}
        }).select("+password")
        if(!user){
            return res.status(400).json({
                success:false,
                message:"otp invalid or has been expired"
            })
        }
        user.password=newPassword
        user.resetPasswordOtp=null;
        user.resetPasswordOtpExpiry=null
        await user.save()
        res.status(200).json({
            success:true,
            message:"Password Changed Successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}





