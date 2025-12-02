const mongoose=require("mongoose")

const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
    },
    icon:{
        type:String,
        default:"🍽️"
    },
    isActive:{
        type:Boolean,
        default:true
    },
    order:{
        type:Number,
        default:0
    }
},{timestamps:true})

module.exports=mongoose.model("Category",categorySchema)

