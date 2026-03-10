import React, { useEffect, useState } from 'react'
import api from '../services/api.js'

export default function ShopDashboard(){
  const [products, setProducts] = useState([])
  const [purchases, setPurchases] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', category: '', price: 0, stock_quantity: 0, shop_id: 1 })
  const [showAddForm, setShowAddForm] = useState(false)
  const [me, setMe] = useState(null)
  const currency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(v || 0))
  const formatIST = (d) => new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  function set(k, v){ setForm(prev => ({ ...prev, [k]: v })) }

  useEffect(() => {
    fetchData()
    // Simple polling to keep inventory fresh
    const id = setInterval(() => {
      fetchData()
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const fetchData = async () => {
    try {
      const [meRes, productsRes, purchasesRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/products'),
        api.get('/purchases')
      ])
      setMe(meRes.data)
      setProducts(productsRes.data)
      const purchases = purchasesRes.data || []
      setPurchases(purchases)
      const totalRevenue = purchases.reduce((s, p) => s + Number(p.total_price || 0), 0)
      const totalOrders = purchases.length
      const totalItemsSold = purchases.reduce((s, p) => s + Number(p.quantity || 0), 0)
      setAnalytics({ totalRevenue, totalOrders, totalItemsSold })
    } catch (error) {
      console.error('Error fetching data:', error)
      // Use sample data if API fails
      setProducts([
        { id: 1, name: 'Kobyashi Seeds', category: 'Seeds', price: 25.99, stock_quantity: 100 },
        { id: 2, name: 'Home Farming Seeds', category: 'Seeds', price: 15.50, stock_quantity: 75 },
        { id: 3, name: 'Garlic Seeds', category: 'Seeds', price: 12.99, stock_quantity: 50 },
        { id: 4, name: 'Seeds Medicine', category: 'Medicine', price: 35.00, stock_quantity: 30 },
        { id: 5, name: 'Hybrid Seeds', category: 'Seeds', price: 45.99, stock_quantity: 60 }
      ])
      setPurchases([
        { id: 1, product_id: 1, quantity: 5, total_price: 129.95, purchase_date: '2024-01-15' },
        { id: 2, product_id: 2, quantity: 3, total_price: 46.50, purchase_date: '2024-01-20' },
        { id: 3, product_id: 3, quantity: 2, total_price: 25.98, purchase_date: '2024-01-25' }
      ])
    } finally {
      setLoading(false)
    }
  }

  async function addProduct(e){
    e.preventDefault()
    try {
      // Use shop_id = 1 (the shop we created in the database)
      const productData = {
        ...form,
        shop_id: 1
      }
      
      console.log('Adding product with data:', productData)
      const { data } = await api.post('/products', productData)
      setProducts(prev => [data, ...prev])
      setForm({ name: '', category: '', price: 0, stock_quantity: 0, shop_id: 1 })
      setShowAddForm(false)
      alert('Product added successfully!')
      
      // Refresh data to ensure consistency
      fetchData()
    } catch (error) {
      console.error('Error adding product:', error)
      alert(`Failed to add product: ${error.response?.data?.message || error.message}`)
    }
  }

  const updateProduct = async (productId, updates) => {
    try {
      const { data } = await api.put(`/products/${productId}`, updates)
      setProducts(products.map(p => p.id === productId ? data : p))
      alert('Product updated successfully!')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    }
  }

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`)
        setProducts(products.filter(p => p.id !== productId))
        alert('Product deleted successfully!')
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product')
      }
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <h2>🏪 Shop Dashboard</h2>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '24px' }}>Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h2>🏪 Shop Dashboard</h2>
      {me && (
        <div style={{ margin: '6px 0 16px', color: '#2d5a27' }}>
          <strong>{me.name}</strong>{me.shopName ? ` — ${me.shopName}` : ''}
        </div>
      )}
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📊 Sales Overview</h3>
          <p>Total Products: {products.length}</p>
          <p>Total Sales: {purchases.length}</p>
          <p>Items Sold: {analytics?.totalItemsSold ?? purchases.reduce((sum, p) => sum + Number(p.quantity || 0), 0)}</p>
          <p>Revenue: {currency(purchases.reduce((sum, p) => sum + parseFloat(p.total_price || 0), 0))}</p>
        </div>
        
        <div className="dashboard-card">
          <h3>📦 Inventory Management</h3>
          <p>Manage your product inventory and stock levels</p>
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>
        
        <div className="dashboard-card">
          <h3>📈 Sales Analytics</h3>
          {analytics ? (
            <div>
              <p>Total Revenue: {currency(analytics.totalRevenue)}</p>
              <p>Total Orders: {analytics.totalOrders}</p>
              <p>Total Items Sold: {analytics.totalItemsSold}</p>
            </div>
          ) : (
            <p>Loading analytics...</p>
          )}
          <button className="btn btn-primary" onClick={fetchData}>Refresh Analytics</button>
        </div>
      </div>

      {showAddForm && (
        <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', margin: '20px 0' }}>
          <h3>Add New Product</h3>
          <form onSubmit={addProduct} style={{ display: 'grid', gap: '15px', maxWidth: '500px' }}>
            <div className="form-group">
              <label>Product Name</label>
              <input 
                placeholder="Enter product name" 
                value={form.name}
                onChange={e => set('name', e.target.value)} 
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} required>
                <option value="">Select Category</option>
                <option value="Seeds">Seeds</option>
                <option value="Medicine">Medicine</option>
                <option value="Equipment">Equipment</option>
                <option value="Fertilizer">Fertilizer</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  value={form.price}
                  onChange={e => set('price', parseFloat(e.target.value) || 0)} 
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={form.stock_quantity}
                  onChange={e => set('stock_quantity', parseInt(e.target.value) || 0)} 
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">Add Product</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>📦 My Products</h3>
          <button 
            className="btn btn-primary" 
            onClick={fetchData}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            🔄 Refresh Products
          </button>
        </div>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.category === 'Seeds' ? '🌱' : 
                 product.category === 'Medicine' ? '💊' : 
                 product.category === 'Equipment' ? '🔧' : 
                 product.category === 'Fertilizer' ? '🌿' : '🛠️'}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">{currency(product.price)}</div>
                <div className="product-category">{product.category}</div>
                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#6c757d' }}>
                  Stock: {product.stock_quantity} units
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                  <button 
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '5px 10px' }}
                    onClick={() => {
                      const newStock = prompt('Enter new stock quantity:', product.stock_quantity)
                      if (newStock !== null) {
                        updateProduct(product.id, { stock_quantity: parseInt(newStock) })
                      }
                    }}
                  >
                    Update Stock
                  </button>
                  <button 
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', padding: '5px 10px' }}
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>🛒 Recent Sales</h3>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {purchases.length > 0 ? (
            <div style={{ display: 'grid', gap: '10px' }}>
              {purchases.map(purchase => {
                const product = products.find(prod => prod.id === purchase.product_id)
                const productName = product?.name || purchase.product_name || 'Unknown Product'
                const isDeleted = !product && purchase.product_name
                return (
                  <div key={purchase.id} style={{ padding: '15px', border: '1px solid #e9ecef', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{productName}</strong>
                        {isDeleted && <span style={{ color: '#dc3545', marginLeft: '8px', fontSize: '0.85rem' }}>(Product Deleted)</span>}
                        <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                          Quantity: {purchase.quantity} | Date: {formatIST(purchase.purchase_date)}
                        </div>
                      </div>
                      <div style={{ color: '#28a745', fontWeight: 'bold' }}>
                        {currency(purchase.total_price)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p>No sales yet. Start adding products to see sales here!</p>
          )}
        </div>
      </div>
    </div>
  )
}


