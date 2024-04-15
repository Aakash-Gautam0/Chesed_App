const mongoose = require("mongoose")
const schema = mongoose.Schema

const feedbackSchema=new schema({
    userId:{
        type:String
    },
    title:{
        type:String
    },
    description:{ 
        type:String
    }
})

const feedbackModel = mongoose.model("feedback", feedbackSchema)
module.exports = feedbackModel;      