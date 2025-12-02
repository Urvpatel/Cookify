import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user') || '{}'
    let user = {}
    
    try {
      user = JSON.parse(userStr)
    } catch (e) {
      user = {}
    }
    
    if (!token) {
      setLoading(false)
      setIsAdmin(false)
      return
    }
    
    const adminCheck = user?.role === 'admin' || user?.email === 'admin@cookify.com'
    setIsAdmin(adminCheck)
    setLoading(false)
  }, [])
  
  if (loading) {
    return <div className="admin-loading">Checking access...</div>
  }
  
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/" replace />
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }
  
  return children
}

