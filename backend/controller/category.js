const Category=require("../models/category")

const getCategories=async(req,res)=>{
    try{
        const categories=await Category.find({isActive:true}).sort({order:1, name:1})
        return res.json(categories)
    }catch(err){
        return res.status(500).json({message:"Failed to fetch categories"})
    }
}

const addCategory=async(req,res)=>{
    try{
        const {name}=req.body 

        if(!name || !name.trim()){
            return res.status(400).json({message:"Category name is required"})
        }

        const trimmedName = name.trim()
        const category=await Category.findOne({
            name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
        })
        
        if(category){
            return res.status(400).json({message:"Category already exists"})
        }

        const iconMap = {
            'breakfast': '🥐', 'lunch': '🍱', 'dinner': '🍝',
            'quick': '⚡', 'quick bites': '⚡', 'sweet': '🍰',
            'something sweet': '🍰', 'dessert': '🍰', 'snack': '🍿',
            'appetizer': '🥗', 'drink': '🥤', 'soup': '🍲', 'salad': '🥗'
        }
        const defaultIcon = iconMap[trimmedName.toLowerCase()] || '🍽️'
        
        const newCategory=await Category.create({
            name:trimmedName,
            description: "",
            icon: defaultIcon,
            isActive: true,
            order: 0
        })
        
        return res.status(201).json(newCategory)
    }catch(err){
        if(err.code === 11000){
            return res.status(400).json({message:"Category already exists"})
        }
        return res.status(500).json({message:"Failed to create category"})
    }
}

const deleteCategory=async(req,res)=>{
    try{
        await Category.deleteOne({_id:req.params.id})
        res.json({status:"ok"})
    }
    catch(err){
        return res.status(400).json({message:"Failed to delete category"})
    }
}

const updateCategory=async(req,res)=>{
    try{
        const {name}=req.body 
        
        if(!name || !name.trim()){
            return res.status(400).json({message:"Category name is required"})
        }
        
        const trimmedName = name.trim()
        const existingCategory = await Category.findOne({
            _id: { $ne: req.params.id },
            name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
        })
        
        if(existingCategory){
            return res.status(400).json({message:"Category name already exists"})
        }
        
        const category=await Category.findByIdAndUpdate(
            req.params.id,
            {name:trimmedName},
            {new:true, runValidators: true}
        )
        if(!category){
            return res.status(404).json({message:"Category not found"})
        }
        res.json(category)
    }
    catch(err){
        if(err.code === 11000){
            return res.status(400).json({message:"Category name already exists"})
        }
        return res.status(500).json({message:"Failed to update category"})
    }
}

module.exports={getCategories,addCategory,deleteCategory,updateCategory}

