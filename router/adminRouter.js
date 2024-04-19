const router = require("express").Router()

const { register ,logIn} = require("../controller/adminController")

router.post("/register", register)
router.get("/logIn",logIn)


module.exports = router 