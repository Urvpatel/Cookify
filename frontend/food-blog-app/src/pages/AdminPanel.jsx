import React, { useState, useEffect } from 'react'
import api from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('recipes')
  const [recipes, setRecipes] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userRecipes, setUserRecipes] = useState([])
  const [stats, setStats] = useState({ totalRecipes: 0, totalUsers: 0, recipesByCategory: [] })
  const [loading, setLoading] = useState(true)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categoryForm, setCategoryForm] = useState({ name: '' })
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  
  const getUser = () => {
    try {
      const userStr = localStorage.getItem('user') || '{}'
      return JSON.parse(userStr)
    } catch (e) {
      return {}
    }
  }
  
  const user = getUser()

  useEffect(() => {
    const currentUser = getUser()
    if (!token) {
      navigate('/')
      return
    }
    // Check if user is admin
    const isAdmin = currentUser?.role === 'admin' || currentUser?.email === 'admin@cookify.com'
    if (!isAdmin) {
      alert('Access denied. Admin only.')
      navigate('/')
      return
    }
    fetchInitialCounts()
    fetchData()
  }, [activeTab])

  const fetchInitialCounts = async () => {
    try {
      // Fetch counts for tabs that aren't active to show correct numbers
      // Recipes will be fetched by fetchData() since it's the default active tab
      const [usersRes, categoriesRes] = await Promise.all([
        api.get('/all').catch(() => ({ data: [] })),
        api.get('/category').catch(() => ({ data: [] }))
      ])
      
      if (usersRes.data) {
        setUsers(usersRes.data)
      }
      if (categoriesRes.data) {
        setCategories(categoriesRes.data)
      }
    } catch (error) {
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'recipes') {
        const res = await api.get('/admin/recipes')
        setRecipes(res.data || [])
      } else if (activeTab === 'categories') {
        const res = await api.get('/category')
        setCategories(res.data || [])
      } else if (activeTab === 'users') {
        const res = await api.get('/all')
        setUsers(res.data || [])
      } else if (activeTab === 'stats') {
        const res = await api.get('/admin/stats')
        setStats(res.data || { totalRecipes: 0, totalUsers: 0, recipesByCategory: [] })
      }
    } catch (error) {
      if (activeTab === 'categories') {
        setCategories([])
      } else if (activeTab === 'recipes') {
        setRecipes([])
      } else if (activeTab === 'users') {
        setUsers([])
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRecipes = async (userId) => {
    try {
      const res = await api.get('/recipe')
      const userRecs = res.data.filter(r => r.createdBy === userId || r.createdBy?._id === userId)
      setUserRecipes(userRecs)
    } catch (error) {
    }
  }

  const handleViewUser = async (user) => {
    setSelectedUser(user)
    await fetchUserRecipes(user._id)
  }

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return
    
    try {
      await api.delete(`/admin/recipes/${id}`, {
        headers: { authorization: `bearer ${token}` }
      })
      setRecipes(recipes.filter(r => r._id !== id))
    } catch (error) {
      alert('Failed to delete recipe')
    }
  }

  const handleEditRecipe = (recipe) => {
    setEditingRecipe({ ...recipe })
  }

  const handleUpdateRecipe = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      
      formData.append('title', editingRecipe.title || '')
      formData.append('category', editingRecipe.category || 'All')
      formData.append('time', editingRecipe.time || '')
      
      if (Array.isArray(editingRecipe.ingredients)) {
        formData.append('ingredients', JSON.stringify(editingRecipe.ingredients))
      } else {
        formData.append('ingredients', editingRecipe.ingredients || '')
      }
      
      formData.append('instructions', editingRecipe.instructions || '')
      
      if (editingRecipe.file && editingRecipe.file instanceof File) {
        formData.append('file', editingRecipe.file)
      }

      await api.put(`/admin/recipes/${editingRecipe._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `bearer ${token}`
        }
      })
      setEditingRecipe(null)
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update recipe')
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    
    const categoryName = categoryForm.name?.trim()
    
    if (!categoryName) {
      alert('Category name is required')
      return
    }
    
    if (!window.confirm(`Add category "${categoryName}"?`)) {
      return
    }
    
    try {
      const response = await api.post('/category', {
        name: categoryName
      })
      
      if (response.data) {
        setCategoryForm({ name: '' })
        setShowCategoryForm(false)
        await fetchData()
        alert(`Category "${categoryName}" added successfully!`)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to add category'
      alert(`Error: ${errorMessage}`)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    
    try {
      await api.delete(`/category/${id}`, {
        headers: { authorization: `bearer ${token}` }
      })
      setCategories(categories.filter(c => c._id !== id))
    } catch (error) {
      alert('Failed to delete category')
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category })
  }

  const handleUpdateCategory = async (e) => {
    e.preventDefault()
    
    const categoryName = editingCategory.name?.trim()
    
    if (!categoryName) {
      alert('Category name is required')
      return
    }
    
    if (!window.confirm(`Update category to "${categoryName}"?`)) {
      return
    }
    
    try {
      await api.put(`/category/${editingCategory._id}`, {
        name: categoryName
      }, {
        headers: { authorization: `bearer ${token}` }
      })
      setEditingCategory(null)
      fetchData()
      alert(`Category updated successfully!`)
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update category')
    }
  }

  if (loading && recipes.length === 0 && categories.length === 0) {
    return <div className="admin-loading">Loading...</div>
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🍽️ Admin Panel</h1>
        <p>Manage recipes and categories</p>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'recipes' ? 'active' : ''}
          onClick={() => setActiveTab('recipes')}
        >
          📝 Recipes ({recipes.length})
        </button>
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          🏷️ Categories ({categories.length})
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({users.length})
        </button>
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistics
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'recipes' && (
          <div className="admin-recipes">
            <div className="admin-section-header">
              <h2>All Recipes</h2>
            </div>
            {editingRecipe ? (
              <form className="admin-edit-form" onSubmit={handleUpdateRecipe}>
                <h3>Edit Recipe</h3>
                <div className="form-control">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editingRecipe.title || ''}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-control">
                  <label>Category</label>
                  <select
                    value={editingRecipe.category || 'All'}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, category: e.target.value })}
                  >
                    <option value="All">All</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label>Time</label>
                  <input
                    type="text"
                    value={editingRecipe.time || ''}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, time: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label>Ingredients (comma separated)</label>
                  <textarea
                    value={Array.isArray(editingRecipe.ingredients) ? editingRecipe.ingredients.join(', ') : editingRecipe.ingredients || ''}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, ingredients: e.target.value.split(',').map(i => i.trim()) })}
                    rows="4"
                    required
                  />
                </div>
                <div className="form-control">
                  <label>Instructions</label>
                  <textarea
                    value={editingRecipe.instructions || ''}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, instructions: e.target.value })}
                    rows="6"
                    required
                  />
                </div>
                <div className="form-control">
                  <label>Update Image (optional)</label>
                  <input
                    type="file"
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, file: e.target.files[0] })}
                    accept="image/*"
                  />
                </div>
                <div className="admin-form-actions">
                  <button type="submit">Update Recipe</button>
                  <button type="button" onClick={() => setEditingRecipe(null)}>Cancel</button>
                </div>
              </form>
            ) : (
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
                        <span>👤 {recipe.createdBy?.email || 'Unknown'}</span>
                      </p>
                      <p className="admin-recipe-date">
                        Created: {new Date(recipe.createdAt).toLocaleDateString()}
                      </p>
                      <div className="admin-recipe-actions">
                        <button onClick={() => handleEditRecipe(recipe)}>✏️ Edit</button>
                        <button onClick={() => handleDeleteRecipe(recipe._id)} className="delete-btn">🗑️ Delete</button>
                        <button onClick={() => navigate(`/recipe/${recipe._id}`)}>👁️ View</button>
                      </div>
                    </div>
                  </div>
                ))}
                {recipes.length === 0 && <p className="admin-empty">No recipes found</p>}
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="admin-categories">
            <div className="admin-section-header">
              <h2>Categories</h2>
              <button onClick={() => setShowCategoryForm(!showCategoryForm)}>
                {showCategoryForm ? 'Cancel' : '+ Add Category'}
              </button>
            </div>

            {showCategoryForm && (
              <form className="admin-category-form" onSubmit={handleAddCategory}>
                <div className="form-control">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ name: e.target.value })}
                    placeholder="e.g., Breakfast, Lunch, Dinner"
                    required
                    minLength={2}
                    maxLength={50}
                    autoFocus
                  />
                </div>
                <div className="admin-form-actions">
                  <button type="submit">Add Category</button>
                  <button type="button" onClick={() => {
                    setShowCategoryForm(false)
                    setCategoryForm({ name: '' })
                  }}>Cancel</button>
                </div>
              </form>
            )}

            {editingCategory ? (
              <form className="admin-category-form" onSubmit={handleUpdateCategory}>
                <h3>Edit Category</h3>
                <div className="form-control">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    value={editingCategory.name || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="admin-form-actions">
                  <button type="submit">Update Category</button>
                  <button type="button" onClick={() => setEditingCategory(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="admin-categories-list">
                {categories.map(category => (
                  <div key={category._id} className="admin-category-card">
                    <div className="admin-category-info">
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
                        <span style={{fontSize: '1.5rem'}}>{category.icon || '🍽️'}</span>
                        <h3>{category.name}</h3>
                        {category.isActive === false && (
                          <span style={{padding: '0.25rem 0.5rem', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', fontSize: '0.75rem'}}>Inactive</span>
                        )}
                      </div>
                      {category.description && <p>{category.description}</p>}
                      <div style={{display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem'}}>
                        <span>Order: {category.order || 0}</span>
                        <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="admin-category-actions">
                      <button onClick={() => handleEditCategory(category)}>✏️ Edit</button>
                      <button onClick={() => handleDeleteCategory(category._id)} className="delete-btn">🗑️ Delete</button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && <p className="admin-empty">No categories found. Add your first category!</p>}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-users">
            <div className="admin-section-header">
              <h2>All Users</h2>
            </div>
            {selectedUser ? (
              <div className="admin-user-detail">
                <button onClick={() => setSelectedUser(null)} className="back-btn">← Back to Users</button>
                <div className="user-detail-header">
                  <h3>👤 {selectedUser.email}</h3>
                  <p>Member since {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  <p className="user-recipe-count">Total Recipes: {selectedUser.recipeCount || userRecipes.length}</p>
                </div>
                <div className="user-recipes-section">
                  <h4>User's Recipes</h4>
                  {userRecipes.length > 0 ? (
                    <div className="admin-recipes-list">
                      {userRecipes.map(recipe => (
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
                              <button onClick={() => handleEditRecipe(recipe)}>✏️ Edit</button>
                              <button onClick={() => handleDeleteRecipe(recipe._id)} className="delete-btn">🗑️ Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="admin-empty">This user hasn't created any recipes yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="admin-users-list">
                {users.map(user => (
                  <div key={user._id} className="admin-user-card">
                    <div className="admin-user-info">
                      <h3>{user.email}</h3>
                      <p className="admin-user-meta">
                        <span>📅 Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                        <span>📝 Recipes: {user.recipeCount || 0}</span>
                      </p>
                    </div>
                    <div className="admin-user-actions">
                      <button onClick={() => handleViewUser(user)}>👁️ View Details</button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && <p className="admin-empty">No users found</p>}
              </div>
            )}
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
                <h3>Total Users</h3>
                <p className="stat-number">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="admin-stats-categories">
              <h3>Recipes by Category</h3>
              {stats.recipesByCategory && stats.recipesByCategory.length > 0 ? (
                <div className="admin-category-stats">
                  {stats.recipesByCategory.map(item => (
                    <div key={item._id} className="admin-category-stat-item">
                      <span className="category-name">{item._id || 'All'}</span>
                      <span className="category-count">{item.count} recipes</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-empty">No category data available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

