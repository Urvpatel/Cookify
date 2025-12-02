import api from '../api/client'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddFoodRecipe() {
    const [recipeData, setRecipeData] = useState({ category: 'All' })
    const [categories, setCategories] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/category')
                setCategories(res.data || [])
            } catch (error) {
                setCategories([])
            }
        }
        fetchCategories()
    }, [])

    const onHandleChange = (e) => {
        let val = (e.target.name === "ingredients") ? e.target.value.split(",") : (e.target.name === "file") ? e.target.files[0] : e.target.value
        setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
    }
    const onHandleSubmit = async (e) => {
        e.preventDefault()
        
        const formData = new FormData()
        formData.append('title', recipeData.title || '')
        formData.append('category', recipeData.category || 'All')
        formData.append('time', recipeData.time || '')
        formData.append('ingredients', Array.isArray(recipeData.ingredients) 
            ? JSON.stringify(recipeData.ingredients) 
            : recipeData.ingredients || '')
        formData.append('instructions', recipeData.instructions || '')
        
        if (recipeData.file) {
            formData.append('file', recipeData.file)
        }
        
        try {
            await api.post("/recipe", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': 'bearer ' + localStorage.getItem("token")
                }
            })
            navigate("/")
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add recipe')
        }
    }
    return (
        <>
            <div className='container'>
                <form className='form' onSubmit={onHandleSubmit}>
                    <div className='form-control'>
                        <label>Title</label>
                        <input type="text" className='input' name="title" onChange={onHandleChange}></input>
                    </div>
                    <div className='form-control'>
                        <label>Category</label>
                        <select className='input' name="category" value={recipeData.category || 'All'} onChange={onHandleChange}>
                            <option value="All">All</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='form-control'>
                        <label>Time</label>
                        <input type="text" className='input' name="time" onChange={onHandleChange}></input>
                    </div>
                    <div className='form-control'>
                        <label>Ingredients</label>
                        <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Instructions</label>
                        <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Recipe Image</label>
                        <input type="file" className='input' name="file" onChange={onHandleChange}></input>
                    </div>
                    <button type="submit">Add Recipe</button>
                </form>
            </div>
        </>
    )
}
