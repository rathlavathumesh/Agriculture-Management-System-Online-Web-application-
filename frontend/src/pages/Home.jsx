import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="hero">
        <h1>Agriculture Management System</h1>
        <p>Your complete solution for modern farming and agricultural management</p>
        <div className="hero-buttons">
          <Link to="/products" className="btn btn-primary">View Products</Link>
          <Link to="/register" className="btn btn-secondary">Get Started</Link>
        </div>
      </section>
      
      <section className="page">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>🌱 For Farmers</h3>
            <p>Manage your crops, track purchases, and get expert advice for better yields</p>
            <Link to="/register" className="btn btn-primary">Join as Farmer</Link>
          </div>
          
          <div className="dashboard-card">
            <h3>🏪 For Shop Owners</h3>
            <p>Manage your inventory, track sales, and connect with farmers in your area</p>
            <Link to="/register" className="btn btn-primary">Join as Shop Owner</Link>
          </div>
          
          <div className="dashboard-card">
            <h3>👨‍💼 For Administrators</h3>
            <p>Oversee the entire system, generate reports, and manage users</p>
            <Link to="/register" className="btn btn-primary">Admin Access</Link>
          </div>
        </div>
      </section>
    </div>
  )
}


