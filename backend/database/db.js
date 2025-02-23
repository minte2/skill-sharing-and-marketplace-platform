import mongoose from 'mongoose'

export const connectDB = async() => {
    try{
        await mongoose.connect(process.env.DB)
        console.log("database connect");
        
    } catch(error){
        console.log(error);
        
    }
}