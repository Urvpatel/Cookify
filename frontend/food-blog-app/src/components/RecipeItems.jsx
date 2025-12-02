import React, { useEffect, useMemo, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import api from '../api/client'
import RecipeCard from './RecipeCard'

export default function RecipeItems() {
  const recipes = useLoaderData()
  const navigate = useNavigate()
  const [allRecipes, setAllRecipes] = useState()
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [category, setCategory] = useState('all')
  const [favItems, setFavItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fav')) ?? []
    } catch {
      return []
    }
  })
  const isMyRecipePage = window.location.pathname === '/myRecipe'

  useEffect(() => {
    setAllRecipes(recipes)
    try {
      const stored = JSON.parse(localStorage.getItem('fav')) ?? []
      setFavItems(stored)
    } catch {
      setFavItems([])
    }
  }, [recipes])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/category')
        setCategories(res.data || [])
      } catch {
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  const onDelete = async (id) => {
    try {
      setDeletingId(id)
      await api.delete(`/recipe/${id}`)
      setAllRecipes(prev => prev?.filter(recipe => recipe._id !== id))
      const filterItem = favItems.filter(recipe => recipe._id !== id)
      setFavItems(filterItem)
      localStorage.setItem('fav', JSON.stringify(filterItem))
    } finally {
      setDeletingId(null)
    }
  }

  const favRecipe = (item) => {
    const exists = favItems.some(recipe => recipe._id === item._id)
    const next = exists
      ? favItems.filter(recipe => recipe._id !== item._id)
      : [...favItems, item]
    setFavItems(next)
    localStorage.setItem('fav', JSON.stringify(next))
  }

  const filteredRecipes = useMemo(() => {
    if (!allRecipes) return []
    let result = allRecipes

    if (category !== 'all') {
      // Filter by recipe's category field (from database)
      result = result.filter(r => {
        const recipeCategory = (r.category || '').toLowerCase().trim()
        const selectedCategory = category.toLowerCase().trim()
        
        // Match by category name
        return recipeCategory === selectedCategory || 
               recipeCategory === selectedCategory.replace(/\s+/g, ' ') ||
               recipeCategory.includes(selectedCategory) ||
               selectedCategory.includes(recipeCategory)
      })
    }

    if (!search.trim()) return result
    const term = search.toLowerCase()
    return result.filter(r =>
      r.title?.toLowerCase().includes(term) ||
      r.ingredients?.join(',').toLowerCase().includes(term)
    )
  }, [allRecipes, search, category])

  const suggestions = useMemo(() => {
    if (!allRecipes || !search.trim()) return []
    const term = search.toLowerCase()
    return allRecipes
      .filter(r => r.title?.toLowerCase().includes(term))
      .slice(0, 5)
  }, [allRecipes, search])

  const isEmpty = allRecipes && filteredRecipes.length === 0

  const surpriseMe = () => {
    if (!allRecipes || allRecipes.length === 0) return
    const random = allRecipes[Math.floor(Math.random() * allRecipes.length)]
    if (random?._id) {
      navigate(`/recipe/${random._id}`)
    }
  }

  return (
    <>
      <div className="recipe-toolbar">
        <div className="recipe-toolbar-left">
          <h3>Latest recipes</h3>
          <p>Scroll through dishes shared by the community.</p>
        </div>
        <div className="recipe-toolbar-right">
          <div className="search-wrapper">
            <input
              type="search"
              placeholder="Search by title or ingredient..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map(s => (
                  <div
                    key={s._id}
                    className="search-suggestion-item"
                    onClick={() => setSearch(s.title)}
                  >
                    <span>{s.title}</span>
                    <span>↩</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="button" className="surprise-btn" onClick={surpriseMe}>
            <span>🎲 Surprise me</span>
          </button>
        </div>
      </div>

      <div className="category-strip">
        <button
          key="all"
          type="button"
          className={`category-pill ${category === 'all' ? 'active' : ''}`}
          onClick={() => setCategory('all')}
        >
          <span className="icon">🌈</span>
          <span>All</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            type="button"
            className={`category-pill ${cat.name === category ? 'active' : ''}`}
            onClick={() => setCategory(cat.name)}
          >
            <span className="icon">{cat.icon || '🍽️'}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="card-container">
        {!allRecipes && (
          <>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div className="card skeleton-card" key={idx}>
                <div className="skeleton skeleton-image" />
                <div className="card-body">
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-row" />
                  <span className="card-loading-badge">Cooking up cards…</span>
                </div>
              </div>
            ))}
          </>
        )}

        {isEmpty && (
          <p className="empty-state">
            No recipes found for “{search}”. Try a different keyword.
          </p>
        )}

        {filteredRecipes.map((item) => {
          const isFavourite = favItems.some(res => res._id === item._id)
          return (
            <RecipeCard
              key={item._id}
              recipe={item}
              isMyRecipe={isMyRecipePage}
              isFavourite={isFavourite}
              onToggleFavourite={() => favRecipe(item)}
              onDelete={() => onDelete(item._id)}
              deleting={deletingId === item._id}
            />
          )
        })}
      </div>
    </>
  )
}
