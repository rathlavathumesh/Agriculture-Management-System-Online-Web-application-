import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import FarmerDashboard from './pages/FarmerDashboard.jsx'
import ShopDashboard from './pages/ShopDashboard.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import AboutProject from './pages/AboutProject.jsx'
import Contact from './pages/Contact.jsx'
import Categories from './pages/Categories.jsx'
import Types from './pages/Types.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import './App.css'

function Layout({ children }) {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">AMS</Link>
          <div className="nav-menu">
            <Link to="/" className="nav-link">HOME</Link>
            <Link to="/about" className="nav-link">ABOUT PROJECT</Link>
            <Link to="/products" className="nav-link">ALL PRODUCTS</Link>
            <Link to="/categories" className="nav-link">ALL CATEGORIES</Link>
            <Link to="/types" className="nav-link">ALL TYPES</Link>
            <Link to="/login" className="nav-link">LOGIN</Link>
            <Link to="/register" className="nav-link">REGISTER</Link>
            <Link to="/contact" className="nav-link">CONTACT US</Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutProject />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/types" element={<Types />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/shop" element={<ShopDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Layout>
  )
}


