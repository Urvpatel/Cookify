const Recipes=require("../models/recipe")
const User=require("../models/user")

const getAllRecipesAdmin=async(req,res)=>{
    try{
        const recipes=await Recipes.find().populate('createdBy','email').sort({createdAt:-1})
        return res.json(recipes)
    }catch(err){
        return res.status(500).json({message:"Failed to fetch recipes"})
    }
}

const deleteRecipeAdmin=async(req,res)=>{
    try{
        await Recipes.deleteOne({_id:req.params.id})
        res.json({status:"ok",message:"Recipe deleted successfully"})
    }
    catch(err){
        return res.status(400).json({message:"Failed to delete recipe"})
    }
}

const updateRecipeAdmin=async(req,res)=>{
    try{
        const {title,ingredients,instructions,time,category}=req.body 
        let recipe=await Recipes.findById(req.params.id)

        if(!recipe){
            return res.status(404).json({message:"Recipe not found"})
        }

        let parsedIngredients = ingredients
        try {
            if (typeof ingredients === 'string') {
                parsedIngredients = JSON.parse(ingredients)
            }
        } catch (e) {
            if (typeof ingredients === 'string') {
                parsedIngredients = ingredients.split(',').map(i => i.trim())
            }
        }

        let coverImage=req.file?.filename ? req.file?.filename : recipe.coverImage
        const updatedRecipe=await Recipes.findByIdAndUpdate(
            req.params.id,
            {title,ingredients:parsedIngredients,instructions,time,category,coverImage},
            {new:true}
        )
        res.json(updatedRecipe)
    }
    catch(err){
        return res.status(500).json({message:"Failed to update recipe"})
    }
}

const getStats=async(req,res)=>{
    try{
        const totalRecipes=await Recipes.countDocuments()
        const totalUsers=await User.countDocuments()
        const recipesByCategory=await Recipes.aggregate([
            {$group:{_id:"$category",count:{$sum:1}}},
            {$sort:{count:-1}}
        ])
        res.json({
            totalRecipes,
            totalUsers,
            recipesByCategory
        })
    }catch(err){
        return res.status(500).json({message:"Failed to fetch stats"})
    }
}

module.exports={getAllRecipesAdmin,deleteRecipeAdmin,updateRecipeAdmin,getStats}

