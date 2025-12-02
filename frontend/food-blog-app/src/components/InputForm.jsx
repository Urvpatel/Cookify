import React, { useState } from 'react'
import api from '../api/client'

export default function InputForm({ setIsOpen }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const endpoint = isSignUp ? 'signUp' : 'login'
    
    try {
      const res = await api.post(`/${endpoint}`, { email, password })
      
      if (res.data && res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token)
        const userData = {
          _id: res.data.user._id,
          email: res.data.user.email,
          role: res.data.user.role || (res.data.user.email === 'admin@cookify.com' ? 'admin' : 'user')
        }
        localStorage.setItem('user', JSON.stringify(userData))
        setIsOpen()
        window.location.reload()
      } else {
        setError('Invalid response from server')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please check your credentials.'
      setError(errorMessage)
    }
  }

  return (
    <>
      <form className="form" onSubmit={handleOnSubmit}>
        <div className="form-inner">
          <div className="form-header" />
          <div className="form-control">
            <label>Email</label>
            <input
              type="email"
              className="input"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label>Password</label>
            <input
              type="password"
              className="input"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
          {error !== '' && <h6 className="error">{error}</h6>}
          <p onClick={() => setIsSignUp((pre) => !pre)}>
            {isSignUp ? 'Already have an account' : 'Create new account'}
          </p>
        </div>
      </form>
    </>
  )
}
