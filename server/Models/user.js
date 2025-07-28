import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    height:{
        type: Number,
        required: true
    },
})

export default mongoose.model("User", userSchema)