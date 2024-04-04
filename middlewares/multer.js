const express = require("express");
const multer = require("multer");


const uploadss = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads")
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + ".jpg")
        }
    })
}).single("user_file")


module.exports = uploadss      