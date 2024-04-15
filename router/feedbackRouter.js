const router=require("express").Router()
const userAuth=require("../middlewares/userAuth")

const {create,read,deleteFeedback,findOneFeedback}=require("../controller/feedbackController")


router.post("/create",userAuth,create)
router.get("/read",read)
router.delete("/deleteFeedback",userAuth,deleteFeedback)
router.get("/findOneFeedback",userAuth,findOneFeedback)
module.exports = router 