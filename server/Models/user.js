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
    birthday:{
        type: Date,
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
    weight:{
        type: Number,
        required: true
    },
    refreshToken: String
})

export default mongoose.model("User", userSchema)