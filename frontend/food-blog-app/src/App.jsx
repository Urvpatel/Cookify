import React from 'react'
import './App.css'
import {createBrowserRouter,RouterProvider, useRouteError, useNavigate} from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import api from './api/client'
import  AddFoodRecipe  from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'
import AdminPanel from './pages/AdminPanel'
import UserProfile from './pages/UserProfile'
import AdminRoute from './components/AdminRoute'

// Error boundary component
function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #fef3c7, #fde68a)'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#e67e22' }}>
        Oops! Something went wrong
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        {error?.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '12px 24px',
          fontSize: '1rem',
          background: 'linear-gradient(135deg, #f39c12, #e67e22)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        Go to Home
      </button>
    </div>
  )
}

const getAllRecipes=async()=>{
  try {
    const res = await api.get('/recipe')
    return res.data || []
  } catch {
    return []
  }
}

const getMyRecipes=async()=>{
  try {
    const userStr = localStorage.getItem("user")
    if (!userStr) return []
    const user = JSON.parse(userStr)
    const allRecipes = await getAllRecipes()
    return allRecipes.filter(item=>item.createdBy===user._id)
  } catch (error) {
    return []
  }
}

const getFavRecipes=()=>{
  try {
    const fav = localStorage.getItem("fav")
    return fav ? JSON.parse(fav) : []
  } catch (error) {
    return []
  }
}

const getRecipe=async({params})=>{
  try {
    const recipeRes = await api.get(`/recipe/${params.id}`)
    const recipe = recipeRes.data
    
    if (!recipe || !recipe.createdBy) {
      throw new Error('Recipe not found')
    }

    try {
      const userRes = await api.get(`/user/${recipe.createdBy}`)
      return {...recipe, email: userRes.data?.email || 'Unknown'}
    } catch (userError) {
      return {...recipe, email: 'Unknown'}
    }
  } catch (error) {
    throw new Error('Recipe not found')
  }
}

const router=createBrowserRouter([
  {
    path:"/",
    element:<MainNavigation/>,
    errorElement: <ErrorPage />,
    children:[
      {path:"/",element:<Home/>,loader:getAllRecipes, errorElement: <ErrorPage />},
      {path:"/myRecipe",element:<Home/>,loader:getMyRecipes, errorElement: <ErrorPage />},
      {path:"/favRecipe",element:<Home/>,loader:getFavRecipes, errorElement: <ErrorPage />},
      {path:"/addRecipe",element:<AddFoodRecipe/>, errorElement: <ErrorPage />},
      {path:"/editRecipe/:id",element:<EditRecipe/>, errorElement: <ErrorPage />},
      {path:"/recipe/:id",element:<RecipeDetails/>,loader:getRecipe, errorElement: <ErrorPage />},
      {path:"/admin",element:<AdminRoute><AdminPanel/></AdminRoute>, errorElement: <ErrorPage />},
      {path:"/profile",element:<UserProfile/>, errorElement: <ErrorPage />}
    ]
  }
])

export default function App() {
  return (
   <>
   <RouterProvider router={router}></RouterProvider>
   </>
  )
}
