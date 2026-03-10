import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      // Use per-tab session storage to avoid cross-tab interference
      sessionStorage.setItem('token', data.token)
      // Clear legacy localStorage token if present
      try { localStorage.removeItem('token') } catch {}
      if (data.user.role === 'admin') navigate('/admin')
      else if (data.user.role === 'farmer') navigate('/farmer')
      else navigate('/shop')
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>Login to Your Account</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Don't have an account? <Link to="/register" style={{ color: '#4a7c59', textDecoration: 'none' }}>Register here</Link></p>
        <p><Link to="/forgot-password" style={{ color: '#4a7c59', textDecoration: 'none' }}>Forgot Password?</Link></p>
      </div>
    </div>
  )
}


