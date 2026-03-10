import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'

export default function Register() {
  const [form, setForm] = useState({ role: 'farmer' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  function set(k, v){ setForm(prev => ({ ...prev, [k]: v })) }

  async function onSubmit(e) {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      setMsg('Registered successfully! You can login now.')
    } catch (e) {
      setMsg(e.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>Create Your Account</h2>
      {msg && <div className={msg.includes('successfully') ? 'success-message' : 'error-message'}>{msg}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            onChange={e => set('name', e.target.value)} 
            required 
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email"
            onChange={e => set('email', e.target.value)} 
            required 
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            onChange={e => set('password', e.target.value)} 
            required 
            placeholder="Create a password"
          />
        </div>
        <div className="form-group">
          <label>Account Type</label>
          <select value={form.role} onChange={e => set('role', e.target.value)}>
            <option value="farmer">🌱 Farmer</option>
            <option value="shop">🏪 Shop Owner</option>
            <option value="admin">👨‍💼 Administrator</option>
          </select>
        </div>
        
        {form.role === 'farmer' && (
          <>
            <div className="form-group">
              <label>Aadhar Number</label>
              <input 
                placeholder="Enter 12-digit Aadhar number" 
                onChange={e => set('aadhar_number', e.target.value)} 
                maxLength="12"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                placeholder="Enter your phone number" 
                onChange={e => set('phone', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input 
                placeholder="Enter your address" 
                onChange={e => set('address', e.target.value)} 
              />
            </div>
          </>
        )}
        
        {form.role === 'shop' && (
          <>
            <div className="form-group">
              <label>Shop Name</label>
              <input 
                placeholder="Enter your shop name" 
                onChange={e => set('shop_name', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Shop Location</label>
              <input 
                placeholder="Enter shop location" 
                onChange={e => set('location', e.target.value)} 
              />
            </div>
          </>
        )}
        
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Already have an account? <Link to="/login" style={{ color: '#4a7c59', textDecoration: 'none' }}>Login here</Link></p>
      </div>
    </div>
  )
}


