const mongoose = require("mongoose")
const schema = mongoose.Schema

const adminSchema = new schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },

    password: {
        type: String,
        require: true
    }
})

const adminModel = mongoose.model("admin", adminSchema)
module.exports = adminModel;