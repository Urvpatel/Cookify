import React, { useState, useEffect } from 'react'
import profileImg from '../assets/profile.png'
import { useLoaderData } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa6'

export default function RecipeDetails() {
  const recipe = useLoaderData()
  const [isFavourite, setIsFavourite] = useState(false)

  useEffect(() => {
    const favItems = JSON.parse(localStorage.getItem('fav')) ?? []
    setIsFavourite(favItems.some(item => item._id === recipe._id))
  }, [recipe._id])

  const toggleFavourite = () => {
    const favItems = JSON.parse(localStorage.getItem('fav')) ?? []
    const exists = favItems.some(item => item._id === recipe._id)
    
    const next = exists
      ? favItems.filter(item => item._id !== recipe._id)
      : [...favItems, recipe]
    
    localStorage.setItem('fav', JSON.stringify(next))
    setIsFavourite(!exists)
  }

  const steps = recipe.instructions
    ? recipe.instructions.split('.').map(s => s.trim()).filter(Boolean)
    : []

  return (
    <>
      <div className='outer-container'>
        <div className='profile'>
          <img src={profileImg} width="50" height="50" alt="Author avatar" />
          <h5>{recipe.email}</h5>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 className='title' style={{ margin: 0 }}>{recipe.title}</h3>
          <FaHeart
            onClick={toggleFavourite}
            className={`favorite-heart ${isFavourite ? 'favorited' : ''}`}
            style={{ 
              color: isFavourite ? '#ef4444' : '#9ca3af',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '2rem',
              marginLeft: '1rem'
            }}
            title={isFavourite ? 'Remove from favorites' : 'Add to favorites'}
          />
        </div>
        <img
          src={`http://localhost:5000/images/${recipe.coverImage}`}
          width="320"
          height="260"
          alt={recipe.title}
        />
        <div className='recipe-details'>
          <div className='ingredients'>
            <h4>Ingredients</h4>
            <ul>
              {recipe.ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className='instructions'>
            <h4>Instructions</h4>
            {steps.length > 0 ? (
              <ol>
                {steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            ) : (
              <span>{recipe.instructions}</span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
