const router=require("express").Router()
const userAuth=require("../middlewares/userAuth")
const uploadss=require("../middlewares/multer")

const {signup,verifyEmailOtp,verifyMobileOtp,logIn,editProfile,forgotPassword,resetPassword,resendOtp,logOut,termsAndConditon}=require("../controller/userController")

router.post("/signup",uploadss,signup)
router.post("/verifyEmailOtp",userAuth,verifyEmailOtp)
router.post("/verifyMobileOtp",userAuth,verifyMobileOtp)

router.get("/logIn",logIn)
router.put("/editProfile",userAuth,editProfile)
router.post("/forgotPassword",userAuth,forgotPassword)
router.post("/resetPassword",userAuth,resetPassword)
router.post("/resendOtp",userAuth,resendOtp)
router.post("/logOut",logOut)
router.post("/termsAndConditon",termsAndConditon)

module.exports = router 