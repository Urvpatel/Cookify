import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isLogin, setIsLogin] = useState(!token)
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
    const handleStorage = () => {
      const newToken = localStorage.getItem('token')
      setToken(newToken)
      setIsLogin(!newToken)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const checkLogin = () => {
    if (token) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setIsLogin(true)
      setToken(null)
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <header>
        <div className="nav-brand">
          <span className="nav-logo-dot" />
          <span className="nav-logo-text">Cookify</span>
        </div>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? '/myRecipe' : '/'}>My recipes</NavLink>
          </li>
          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? '/favRecipe' : '/'}>Favourites</NavLink>
          </li>
          {!isLogin && (
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
          )}
          {!isLogin && (user?.role === 'admin' || user?.email === 'admin@cookify.com') && (
            <li>
              <NavLink to="/admin">Admin</NavLink>
            </li>
          )}
          <li onClick={checkLogin}>
            <p className="login">
              {isLogin ? 'Login' : 'Logout'}
              {user?.email ? ` (${user.email})` : ''}
            </p>
          </li>
        </ul>
      </header>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  )
}
