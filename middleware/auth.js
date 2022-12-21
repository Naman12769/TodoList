import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const isAuthenticated =async(req,res)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"login first"
            })
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded._id);
        // next()
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
// export default isAuthenticated;
