import React, { useState, useEffect } from 'react'
import api from '../api/client'
import { useNavigate } from 'react-router-dom'
import profileImg from '../assets/profile.png'

export default function UserProfile() {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!token) {
      navigate('/')
      return
    }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await api.get('/profile', {
        headers: { authorization: `bearer ${token}` }
      })
      setProfileData(res.data)
    } catch (error) {
      alert('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return
    
    try {
      await api.delete(`/recipe/${id}`, {
        headers: { authorization: `bearer ${token}` }
      })
      fetchProfile() // Refresh profile data
    } catch (error) {
      alert('Failed to delete recipe')
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading your profile...</div>
  }

  if (!profileData) {
    return <div className="admin-loading">Failed to load profile</div>
  }

  const { user: userInfo, recipes, stats } = profileData

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="profile-header-content">
          <img src={profileImg} alt="Profile" className="profile-avatar-large" />
          <div>
            <h1>👤 {userInfo.email}</h1>
            <p>Member since {new Date(userInfo.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={activeTab === 'recipes' ? 'active' : ''}
          onClick={() => setActiveTab('recipes')}
        >
          📝 My Recipes ({recipes.length})
        </button>
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          📈 Statistics
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="profile-overview">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <h3>Total Recipes</h3>
                <p className="stat-number">{stats.totalRecipes}</p>
              </div>
              <div className="admin-stat-card">
                <h3>Account Created</h3>
                <p className="stat-date">{new Date(userInfo.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="profile-recent-recipes">
              <h2>Recent Recipes</h2>
              {recipes.slice(0, 3).length > 0 ? (
                <div className="admin-recipes-list">
                  {recipes.slice(0, 3).map(recipe => (
                    <div key={recipe._id} className="admin-recipe-card">
                      <div className="admin-recipe-image">
                        {recipe.coverImage ? (
                          <img src={`http://localhost:5000/images/${recipe.coverImage}`} alt={recipe.title} />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </div>
                      <div className="admin-recipe-info">
                        <h3>{recipe.title}</h3>
                        <p className="admin-recipe-meta">
                          <span>📁 {recipe.category || 'All'}</span>
                          <span>⏱️ {recipe.time || 'N/A'}</span>
                        </p>
                        <p className="admin-recipe-date">
                          Created: {new Date(recipe.createdAt).toLocaleDateString()}
                        </p>
                        <div className="admin-recipe-actions">
                          <button onClick={() => navigate(`/recipe/${recipe._id}`)}>👁️ View</button>
                          <button onClick={() => navigate(`/editRecipe/${recipe._id}`)}>✏️ Edit</button>
                          <button onClick={() => handleDeleteRecipe(recipe._id)} className="delete-btn">🗑️ Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-empty">No recipes yet. <button onClick={() => navigate('/addRecipe')} className="link-btn">Create your first recipe!</button></p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="admin-recipes">
            <div className="admin-section-header">
              <h2>All My Recipes</h2>
              <button onClick={() => navigate('/addRecipe')}>+ Add Recipe</button>
            </div>
            <div className="admin-recipes-list">
              {recipes.map(recipe => (
                <div key={recipe._id} className="admin-recipe-card">
                  <div className="admin-recipe-image">
                    {recipe.coverImage ? (
                      <img src={`http://localhost:5000/images/${recipe.coverImage}`} alt={recipe.title} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="admin-recipe-info">
                    <h3>{recipe.title}</h3>
                    <p className="admin-recipe-meta">
                      <span>📁 {recipe.category || 'All'}</span>
                      <span>⏱️ {recipe.time || 'N/A'}</span>
                    </p>
                    <p className="admin-recipe-date">
                      Created: {new Date(recipe.createdAt).toLocaleDateString()}
                    </p>
                    <div className="admin-recipe-actions">
                      <button onClick={() => navigate(`/recipe/${recipe._id}`)}>👁️ View</button>
                      <button onClick={() => navigate(`/editRecipe/${recipe._id}`)}>✏️ Edit</button>
                      <button onClick={() => handleDeleteRecipe(recipe._id)} className="delete-btn">🗑️ Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {recipes.length === 0 && (
                <p className="admin-empty">
                  No recipes yet. <button onClick={() => navigate('/addRecipe')} className="link-btn">Create your first recipe!</button>
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="admin-stats">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <h3>Total Recipes</h3>
                <p className="stat-number">{stats.totalRecipes}</p>
              </div>
              <div className="admin-stat-card">
                <h3>Account Created</h3>
                <p className="stat-date">{new Date(userInfo.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            {stats.recipesByCategory && stats.recipesByCategory.length > 0 && (
              <div className="admin-stats-categories">
                <h3>Recipes by Category</h3>
                <div className="admin-category-stats">
                  {stats.recipesByCategory.map(item => (
                    <div key={item._id} className="admin-category-stat-item">
                      <span className="category-name">{item._id || 'All'}</span>
                      <span className="category-count">{item.count} recipes</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


