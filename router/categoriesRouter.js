const router=require("express").Router()
const userAuth=require("../middlewares/userAuth")
const categorieController=require("../controller/categorieController")


const {createRideShareRqst,createPackageTransport,createGemochFinder,createAdvice,getAllDetails,getDetailsByCategory}=require("../controller/categorieController")

router.post("/createRideShareRqst",userAuth,createRideShareRqst)
router.post("/createPackageTransport",userAuth,createPackageTransport)
router.post("/createGemochFinder",userAuth,createGemochFinder)
router.post("/createAdvice",userAuth,createAdvice)
router.get("/getAllDetails",userAuth,getAllDetails)
router.get("/getDetailsByCategory",getDetailsByCategory)

// router.get('/details', categorieController.getAllDetails);


module.exports = router 

