import React, { useEffect, useState } from 'react'
import api from '../services/api.js'

export default function Categories() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const currency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(v || 0))

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products')
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Use sample data if API fails
      setProducts([
        { id: 1, name: 'Kobyashi Seeds', category: 'Seeds', price: 25.99, stock_quantity: 100 },
        { id: 2, name: 'Home Farming Seeds', category: 'Seeds', price: 15.50, stock_quantity: 75 },
        { id: 3, name: 'Garlic Seeds', category: 'Seeds', price: 12.99, stock_quantity: 50 },
        { id: 4, name: 'Seeds Medicine', category: 'Medicine', price: 35.00, stock_quantity: 30 },
        { id: 5, name: 'Hybrid Seeds', category: 'Seeds', price: 45.99, stock_quantity: 60 },
        { id: 6, name: 'Radish Seeds', category: 'Vegetables', price: 8.99, stock_quantity: 80 },
        { id: 7, name: 'Crop Sprayer', category: 'Equipment', price: 89.99, stock_quantity: 15 },
        { id: 8, name: 'Black Seeds', category: 'Seeds', price: 18.50, stock_quantity: 40 },
        { id: 9, name: 'Green Grains', category: 'Grains', price: 22.99, stock_quantity: 90 },
        { id: 10, name: 'Tomato Seeds', category: 'Vegetables', price: 14.99, stock_quantity: 65 },
        { id: 11, name: 'Organic Fertilizer', category: 'Fertilizer', price: 29.99, stock_quantity: 45 },
        { id: 12, name: 'Garden Tools Set', category: 'Tools', price: 49.99, stock_quantity: 25 }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories
  const categories = ['All', ...new Set(products.map(p => p.category))]

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  if (loading) {
    return (
      <div className="page">
        <h1>All Categories</h1>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '24px' }}>Loading categories...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <h1 style={{ textAlign: 'center', color: '#2d5a27', marginBottom: '40px' }}>All Categories</h1>
      
      {/* Category Filter */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px', 
        justifyContent: 'center', 
        marginBottom: '40px',
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '10px 20px',
              border: selectedCategory === category ? '2px solid #4a7c59' : '2px solid #e9ecef',
              borderRadius: '25px',
              background: selectedCategory === category ? '#4a7c59' : 'white',
              color: selectedCategory === category ? 'white' : '#2d5a27',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            {category} ({category === 'All' ? products.length : products.filter(p => p.category === category).length})
          </button>
        ))}
      </div>

      {/* Category Description */}
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#2d5a27', marginBottom: '15px' }}>
          {selectedCategory === 'All' ? 'All Products' : selectedCategory} Products
        </h2>
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          {selectedCategory === 'All' 
            ? `Browse through all ${products.length} agricultural products available in our system.`
            : `Discover ${filteredProducts.length} ${selectedCategory.toLowerCase()} products to enhance your farming experience.`
          }
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.category === 'Seeds' ? '🌱' : 
                 product.category === 'Medicine' ? '💊' : 
                 product.category === 'Equipment' ? '🔧' : 
                 product.category === 'Fertilizer' ? '🌿' : 
                 product.category === 'Tools' ? '🛠️' : 
                 product.category === 'Vegetables' ? '🥕' : 
                 product.category === 'Grains' ? '🌾' : '📦'}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">{currency(product.price)}</div>
                <div className="product-category">{product.category}</div>
                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#6c757d' }}>
                  Stock: {product.stock_quantity} units
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px', 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
          <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>No Products Found</h3>
          <p style={{ color: '#6c757d' }}>
            No products available in the {selectedCategory} category. 
            Try selecting a different category or check back later.
          </p>
        </div>
      )}

      {/* Category Statistics */}
      <div style={{ 
        marginTop: '40px', 
        background: 'linear-gradient(135deg, #4a7c59, #6b9b6b)', 
        color: 'white', 
        padding: '30px', 
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '20px' }}>Category Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
          {categories.slice(1).map(category => {
            const count = products.filter(p => p.category === category).length
            return (
              <div key={category}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                  {category === 'Seeds' ? '🌱' : 
                   category === 'Medicine' ? '💊' : 
                   category === 'Equipment' ? '🔧' : 
                   category === 'Fertilizer' ? '🌿' : 
                   category === 'Tools' ? '🛠️' : 
                   category === 'Vegetables' ? '🥕' : 
                   category === 'Grains' ? '🌾' : '📦'}
                </div>
                <h4>{category}</h4>
                <p>{count} products</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

