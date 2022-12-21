import mongoose from 'mongoose'
const connectDatabase=async()=>{
    try {
        const connection=await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb connected:${connection.host} `)
    } catch (error) {
     console.log("error is ", error)   
    }
   
}
export default connectDatabase;