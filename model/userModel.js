const mongoose = require("mongoose")
const schema = mongoose.Schema

const userSchema = new schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    mobileNumber: {
        type: String,
    },
    password: {
        type: String,
        require: true
    },
    emailOtp: {
        type: String
    },
    mobileNumberOtp: {
        type: String
    },
    emailOtpExpires: {
        type: Date
    },
    mobileNumberOtpExpires:{
        type: Date
    },
    profilePic:{
        type:String
    },


    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Delete'],
        default: 'Active'
    },
    isVerified:{
        type:Boolean,
        default:"false"
    }


})

const userModel = mongoose.model("user", userSchema)
module.exports = userModel;