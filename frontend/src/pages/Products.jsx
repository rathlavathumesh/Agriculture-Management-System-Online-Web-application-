import React, { useEffect, useState } from 'react'
import api from '../services/api.js'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
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
        {
          id: 1,
          name: 'Kobyashi Seeds',
          category: 'Seeds',
          price: 25.99,
          stock_quantity: 100,
          image: '🌾'
        },
        {
          id: 2,
          name: 'Home Farming Seeds',
          category: 'Seeds',
          price: 15.50,
          stock_quantity: 75,
          image: '🌱'
        },
        {
          id: 3,
          name: 'Garlic Seeds',
          category: 'Seeds',
          price: 12.99,
          stock_quantity: 50,
          image: '🧄'
        },
        {
          id: 4,
          name: 'Seeds Medicine',
          category: 'Medicine',
          price: 35.00,
          stock_quantity: 30,
          image: '💊'
        },
        {
          id: 5,
          name: 'Hybrid Seeds',
          category: 'Seeds',
          price: 45.99,
          stock_quantity: 60,
          image: '🌽'
        },
        {
          id: 6,
          name: 'Radish Seeds',
          category: 'Vegetables',
          price: 8.99,
          stock_quantity: 80,
          image: '🥕'
        },
        {
          id: 7,
          name: 'Crop Sprayer',
          category: 'Equipment',
          price: 89.99,
          stock_quantity: 15,
          image: '🚿'
        },
        {
          id: 8,
          name: 'Black Seeds',
          category: 'Seeds',
          price: 18.50,
          stock_quantity: 40,
          image: '⚫'
        },
        {
          id: 9,
          name: 'Green Grains',
          category: 'Grains',
          price: 22.99,
          stock_quantity: 90,
          image: '🌾'
        },
        {
          id: 10,
          name: 'Tomato Seeds',
          category: 'Vegetables',
          price: 14.99,
          stock_quantity: 65,
          image: '🍅'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="products-header">
        <h1>ALL PRODUCTS</h1>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '24px' }}>Loading products...</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="products-header">
        <h1>ALL PRODUCTS</h1>
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image || '🌱'}
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
    </div>
  )
}


