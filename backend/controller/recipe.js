const Recipes=require("../models/recipe")
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + '-' + file.fieldname
      cb(null, filename)
    }
  })
  
const upload = multer({ storage: storage })

const getRecipes=async(req,res)=>{
    try{
        const { q } = req.query
        const filter = {}
        if (q) {
            filter.title = { $regex: q, $options: 'i' }
        }
        const recipes=await Recipes.find(filter).sort({createdAt:-1})
        return res.json(recipes)
    }catch(err){
        return res.status(500).json({message:"Failed to fetch recipes"})
    }
}

const getRecipe=async(req,res)=>{
    try{
        const recipe=await Recipes.findById(req.params.id)
        if(!recipe){
            return res.status(404).json({message:"Recipe not found"})
        }
        res.json(recipe)
    }catch(err){
        return res.status(500).json({message:"Failed to fetch recipe"})
    }
}

const addRecipe=async(req,res)=>{
    try{
        const {title,ingredients,instructions,time,category}=req.body 

        if(!title || !ingredients || !instructions){
            return res.status(400).json({message:"Required fields can't be empty"})
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

        const newRecipe=await Recipes.create({
            title,ingredients:parsedIngredients,instructions,time,category:category || "All",coverImage:req.file?.filename,
            createdBy:req.user.id
        })
        return res.status(201).json(newRecipe)
    }catch(err){
        return res.status(500).json({message:"Failed to create recipe"})
    }
}

const editRecipe=async(req,res)=>{
    try{
        const {title,ingredients,instructions,time}=req.body 
        let recipe=await Recipes.findById(req.params.id)

        if(!recipe){
            return res.status(404).json({message:"Recipe not found"})
        }

        let coverImage=req.file?.filename ? req.file?.filename : recipe.coverImage
        await Recipes.findByIdAndUpdate(
            req.params.id,
            {...req.body,coverImage},
            {new:true}
        )
        res.json({title,ingredients,instructions,time})
    }
    catch(err){
        return res.status(500).json({message:"Failed to update recipe"})
    }
}

const deleteRecipe=async(req,res)=>{
    try{
        await Recipes.deleteOne({_id:req.params.id})
        res.json({status:"ok"})
    }
    catch(err){
        return res.status(400).json({message:"Failed to delete recipe"})
    }
}

module.exports={getRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe,upload}