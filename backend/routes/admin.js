const express=require("express")
const { getAllRecipesAdmin,deleteRecipeAdmin,updateRecipeAdmin,getStats} = require("../controller/admin")
const { upload } = require("../controller/recipe")
const { verifyAdmin } = require("../middleware/adminAuth")
const router=express.Router()

router.get("/recipes",verifyAdmin,getAllRecipesAdmin)
router.get("/stats",verifyAdmin,getStats)
router.delete("/recipes/:id",verifyAdmin,deleteRecipeAdmin)
router.put("/recipes/:id",upload.single('file'),verifyAdmin,updateRecipeAdmin)

module.exports=router

