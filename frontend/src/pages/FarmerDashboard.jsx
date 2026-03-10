import React, { useEffect, useState } from 'react'
import api from '../services/api.js'

export default function FarmerDashboard(){
  const [products, setProducts] = useState([])
  const [purchases, setPurchases] = useState([])
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCrop, setNewCrop] = useState({ crop_name: '', planting_date: '', harvest_date: '' })
  const [showPurchases, setShowPurchases] = useState(false)
  const [me, setMe] = useState(null)
  const currency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(v || 0))
  const formatIST = (d) => new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  useEffect(() => {
    fetchData()
    const id = setInterval(() => {
      fetchData()
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const fetchData = async () => {
    try {
      console.log('Fetching data for farmer dashboard...')
      const [meRes, productsRes, purchasesRes, cropsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/products'),
        api.get('/purchases'),
        api.get('/crops')
      ])
      setMe(meRes.data)
      console.log('Products fetched:', productsRes.data)
      setProducts(productsRes.data || [])
      setPurchases(purchasesRes.data || [])
      setCrops(cropsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      // Only use sample data for crops, not products - we want real products from shop
      setCrops([
        { id: 1, crop_name: 'Wheat', planting_date: '2024-01-01', harvest_date: '2024-06-01' },
        { id: 2, crop_name: 'Rice', planting_date: '2024-02-01', harvest_date: '2024-08-01' }
      ])
      // Set empty arrays for products and purchases if API fails
      setProducts([])
      setPurchases([])
    } finally {
      setLoading(false)
    }
  }

  const addCrop = async (e) => {
    e.preventDefault()
    try {
      const cropData = {
        ...newCrop,
        farmer_id: 1
      }
      const { data } = await api.post('/crops', cropData)
      setCrops([...crops, data])
      setNewCrop({ crop_name: '', planting_date: '', harvest_date: '' })
      document.getElementById('cropModal').style.display = 'none'
    } catch (error) {
      console.error('Error adding crop:', error)
      alert(`Failed to add crop: ${error.response?.data?.message || error.message}`)
    }
  }

  const buyProduct = async (productId, quantity) => {
    try {
      const product = products.find(p => p.id === productId)
      if (!product) {
        alert('Product not found')
        return
      }

      // Validate quantity
      const qtyInt = parseInt(quantity)
      if (!Number.isFinite(qtyInt) || qtyInt <= 0) {
        alert('Please enter a valid quantity')
        return
      }
      if (qtyInt > Number(product.stock_quantity || 0)) {
        alert('Insufficient stock')
        return
      }

      // Use farmer_id = 1 (the farmer we created in the database)
      const purchaseData = {
        farmer_id: 1,
        product_id: productId,
        quantity: qtyInt,
        total_price: product.price * qtyInt
      }
      
      console.log('Making purchase with data:', purchaseData)
      const { data } = await api.post('/purchases', purchaseData)
      setPurchases([...purchases, data])
      // Optimistically update local products list to reflect new stock
      if (data?.product?.id === productId && typeof data.product.stock_quantity !== 'undefined') {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock_quantity: data.product.stock_quantity } : p))
      } else {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock_quantity: Number(p.stock_quantity || 0) - qtyInt } : p))
      }
      alert('Purchase successful!')
      
      // Refresh data to ensure consistency
      fetchData()
    } catch (error) {
      console.error('Error making purchase:', error)
      alert(`Purchase failed: ${error.response?.data?.message || error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <h2>🌱 Farmer Dashboard</h2>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '24px' }}>Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h2>🌱 Farmer Dashboard</h2>
      {me && (
        <div style={{ margin: '6px 0 16px', color: '#2d5a27' }}>
          <strong>{me.name}</strong>{me.farmerAadhar ? ` (Aadhar: ${me.farmerAadhar})` : ''}
        </div>
      )}
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📊 My Stats</h3>
          <p>Total Purchases: {purchases.length}</p>
          <p>Active Crops: {crops.length}</p>
          <p>Items Bought: {purchases.reduce((sum, p) => sum + Number(p.quantity || 0), 0)}</p>
          <p>Total Spent: {currency(purchases.reduce((sum, p) => sum + parseFloat(p.total_price || 0), 0))}</p>
        </div>
        
        <div className="dashboard-card">
          <h3>🌾 My Crops</h3>
          <p>Track your crop planting and harvest dates</p>
          <button className="btn btn-primary" onClick={() => document.getElementById('cropModal').style.display = 'block'}>
            Add New Crop
          </button>
        </div>
        
        <div className="dashboard-card">
          <h3>🛒 Recent Purchases</h3>
          <p>View your purchase history and track expenses</p>
          <button className="btn btn-primary" onClick={() => setShowPurchases(true)}>View All Purchases</button>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>🛍️ Available Products</h3>
          <button 
            className="btn btn-primary" 
            onClick={fetchData}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            🔄 Refresh Products
          </button>
        </div>
        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
            <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>No Products Available</h3>
            <p style={{ color: '#6c757d', marginBottom: '20px' }}>
              No products are currently available. This could be because:
            </p>
            <ul style={{ textAlign: 'left', display: 'inline-block', color: '#6c757d' }}>
              <li>Shop owners haven't added any products yet</li>
              <li>There's a connection issue with the server</li>
              <li>Products are being processed</li>
            </ul>
            <div style={{ marginTop: '20px' }}>
              <button 
                className="btn btn-primary" 
                onClick={fetchData}
                style={{ marginRight: '10px' }}
              >
                🔄 Try Again
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => window.location.href = '/products'}
              >
                View All Products
              </button>
            </div>
          </div>
        )}
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.category === 'Seeds' ? '🌱' : 
                 product.category === 'Medicine' ? '💊' : 
                 product.category === 'Equipment' ? '🔧' : '🌾'}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">{currency(product.price)}</div>
                <div className="product-category">{product.category}</div>
                <div style={{ marginTop: '10px' }}>
                  <input 
                    type="number" 
                    min="1" 
                    max={product.stock_quantity}
                    placeholder="Qty" 
                    style={{ width: '60px', marginRight: '10px', padding: '5px' }}
                    id={`qty-${product.id}`}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      const qty = document.getElementById(`qty-${product.id}`).value
                      if (qty > 0) buyProduct(product.id, qty)
                    }}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>🌾 My Crops</h3>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {crops.length > 0 ? (
            <div style={{ display: 'grid', gap: '10px' }}>
              {crops.map(crop => (
                <div key={crop.id} style={{ padding: '15px', border: '1px solid #e9ecef', borderRadius: '8px' }}>
                  <strong>{crop.crop_name}</strong>
                  <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    Planted: {formatIST(crop.planting_date)} | Harvest: {crop.harvest_date ? formatIST(crop.harvest_date) : 'TBD'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No crops added yet. Add your first crop!</p>
          )}
        </div>
      </div>

      {/* Add Crop Modal */}
      <div id="cropModal" style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
          <h3>Add New Crop</h3>
          <form onSubmit={addCrop}>
            <div className="form-group">
              <label>Crop Name</label>
              <input 
                value={newCrop.crop_name}
                onChange={e => setNewCrop({...newCrop, crop_name: e.target.value})}
                required
                placeholder="e.g., Wheat, Rice, Corn"
              />
            </div>
            <div className="form-group">
              <label>Planting Date</label>
              <input 
                type="date"
                value={newCrop.planting_date}
                onChange={e => setNewCrop({...newCrop, planting_date: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Expected Harvest Date</label>
              <input 
                type="date"
                value={newCrop.harvest_date}
                onChange={e => setNewCrop({...newCrop, harvest_date: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">Add Crop</button>
              <button type="button" className="btn btn-secondary" onClick={() => document.getElementById('cropModal').style.display = 'none'}>Cancel</button>
            </div>
          </form>
        </div>
      </div>

      {/* Purchases Modal */}
      {showPurchases && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1001 }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '24px', borderRadius: '8px', width: '700px', maxHeight: '80%', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3>All Purchases</h3>
              <button className="btn btn-secondary" onClick={() => setShowPurchases(false)}>Close</button>
            </div>
            {purchases.length === 0 ? (
              <p>No purchases found.</p>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {purchases.map(p => (
                  <div key={p.id} style={{ padding: '12px', border: '1px solid #e9ecef', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>{p.product?.name || p.product_name || 'Product (Deleted)'}</strong>
                        <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                          Category: {p.product?.category || '-'}
                          {!p.product && p.product_name && <span style={{ color: '#dc3545', marginLeft: '8px' }}>(Product Deleted)</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div><strong>{currency(parseFloat(p.total_price || 0))}</strong></div>
                        <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>Qty: {p.quantity}</div>
                      </div>
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: '6px' }}>
                      Purchased on: {formatIST(p.purchase_date || p.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


