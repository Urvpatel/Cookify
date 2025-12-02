const mongoose=require("mongoose")

const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("Database connected")
        return true
    } catch (error) {
        console.error("Database connection failed:", error.message)
        return false
    }
}

module.exports=connectDb