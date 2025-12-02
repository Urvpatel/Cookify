const express=require("express")
const { getCategories,addCategory,deleteCategory,updateCategory} = require("../controller/category")
const verifyToken = require("../middleware/auth")
const router=express.Router()

router.get("/",getCategories)
router.post("/",verifyToken,addCategory)
router.delete("/:id",verifyToken,deleteCategory)
router.put("/:id",verifyToken,updateCategory)

module.exports=router

