const express=require("express")
const router=express.Router()
const {userLogin,userSignUp,getUser,getUserProfile,getAllUsers}=require("../controller/user")
const verifyToken = require("../middleware/auth")

router.post("/signUp",userSignUp)
router.post("/login",userLogin)
router.get("/user/:id",getUser)
router.get("/profile",verifyToken,getUserProfile)
router.get("/all",verifyToken,getAllUsers)

module.exports=router