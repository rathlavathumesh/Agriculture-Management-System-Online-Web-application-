import React, { useEffect, useState } from 'react'
import api from '../services/api.js'

export default function AdminDashboard(){
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [metric, setMetric] = useState(null)
  const [farmerTable, setFarmerTable] = useState([])
  const [shopTable, setShopTable] = useState([])
  const [loading, setLoading] = useState(true)
  const currency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(v || 0))
  const [me, setMe] = useState(null)
  const [showUsers, setShowUsers] = useState(false)
  const [showProducts, setShowProducts] = useState(false)
  const formatIST = (d) => new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [meRes, usersRes, productsRes, purchasesRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/users'),
        api.get('/products'),
        api.get('/purchases')
      ])
      setMe(meRes.data)
      setUsers(usersRes.data)
      setProducts(productsRes.data)

      const purchases = purchasesRes.data || []
      const totalProductsSold = purchases.reduce((s, p) => s + Number(p.quantity || 0), 0)
      setMetric({ totalProductsSold })

      // Build farmer purchases table
      const farmerRows = purchases.map(r => ({
        farmerAadhar: r.farmer?.aadhar_number || r.farmer?.user?.email || '-',
        productName: r.product?.name || r.product_name || 'Product (Deleted)',
        isDeleted: !r.product && r.product_name,
        quantity: Number(r.quantity || 0),
        date: r.purchase_date || r.createdAt,
        totalAmount: Number(r.total_price || 0),
      }))
      setFarmerTable(farmerRows)

      // Build shop sales table
      const shopRows = purchases.map(r => ({
        shopName: r.product?.shop?.name || '-',
        soldProduct: r.product?.name || r.product_name || 'Product (Deleted)',
        isDeleted: !r.product && r.product_name,
        soldToFarmerAadhar: r.farmer?.aadhar_number || '-',
        quantity: Number(r.quantity || 0),
        date: r.purchase_date || r.createdAt,
        totalAmount: Number(r.total_price || 0),
      }))
      setShopTable(shopRows)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId) => {
    try {
      if (!window.confirm('Delete this product? This action cannot be undone.')) return;
      await api.delete(`/products/${productId}`)
      setProducts(prev => prev.filter(p => p.id !== productId))
      alert('Product deleted successfully')
    } catch (e) {
      console.error('Error deleting product:', e)
      alert(e.response?.data?.message || 'Failed to delete product')
    }
  }

  const [deletingUsers, setDeletingUsers] = useState({});

  const deleteUser = async (user) => {
    if (!user) return;
    
    const { id: userId, name: userName, role: userRole } = user;
    
    if (me && userId === me.id) {
      alert('You cannot delete your own admin account');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${userName} (${userRole})?\nThis action cannot be undone.`)) {
      return;
    }

    setDeletingUsers(prev => ({ ...prev, [userId]: true }));
    
    try {
      const response = await api.delete(`/users/${userId}`);
      
      if (response.data && response.data.success) {
        // Update the UI by removing the deleted user
        setUsers(prev => prev.filter(u => u.id !== userId));
        alert(`${userRole} '${userName}' deleted successfully`);
      } else {
        throw new Error(response.data?.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      
      // Refresh the user list to ensure it's in sync with the server
      try {
        const usersRes = await api.get('/users');
        setUsers(usersRes.data);
      } catch (fetchError) {
        console.error('Error refreshing user list:', fetchError);
      }
      
      // Show error message
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to delete user. Please try again.';
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setDeletingUsers(prev => ({ ...prev, [userId]: false }));
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <h2>Admin Dashboard</h2>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '24px' }}>Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h2>👨‍💼 Admin Dashboard</h2>
      {me && (
        <div style={{ margin: '6px 0 16px', color: '#2d5a27' }}>
          <strong>{me.name}</strong>
        </div>
      )}

      {showProducts && (
        <div style={{ marginTop: '40px' }}>
          <h3>Products</h3>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Category</th>
                  <th style={{ padding: '10px' }}>Price</th>
                  <th style={{ padding: '10px' }}>Stock</th>
                  <th style={{ padding: '10px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '10px' }}>{p.name}</td>
                    <td style={{ padding: '10px' }}>{p.category}</td>
                    <td style={{ padding: '10px' }}>{currency(p.price)}</td>
                    <td style={{ padding: '10px' }}>{p.stock_quantity}</td>
                    <td style={{ padding: '10px' }}>
                      <button className="btn btn-secondary" onClick={() => deleteProduct(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📊 System Overview</h3>
          <p>Total Products Sold: {metric?.totalProductsSold || 0}</p>
          <p>Total Items Bought: {farmerTable.reduce((s, r) => s + Number(r.quantity || 0), 0)}</p>
          <p>Total Items Sold: {shopTable.reduce((s, r) => s + Number(r.quantity || 0), 0)}</p>
          <p>Total Farmer Purchases: {currency(farmerTable.reduce((s, r) => s + Number(r.totalAmount || 0), 0))}</p>
          <p>Total Shop Sales: {currency(shopTable.reduce((s, r) => s + Number(r.totalAmount || 0), 0))}</p>
          <p>Total Users: {users.length}</p>
          <p>Total Products: {products.length}</p>
        </div>
        
        <div className="dashboard-card">
          <h3>👥 User Management</h3>
          <p>Manage farmers, shop owners, and administrators</p>
          <button className="btn btn-primary" onClick={() => setShowUsers(v => !v)}>
            {showUsers ? 'Hide Users' : 'Manage Users'}
          </button>
        </div>

        <div className="dashboard-card">
          <h3>🛒 Product Management</h3>
          <p>View and delete products across all shops</p>
          <button className="btn btn-primary" onClick={() => setShowProducts(v => !v)}>
            {showProducts ? 'Hide Products' : 'Manage Products'}
          </button>
        </div>
      </div>

      {showUsers && (
        <div style={{ marginTop: '40px' }}>
          <h3>Users</h3>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Email</th>
                  <th style={{ padding: '10px' }}>Role</th>
                  <th style={{ padding: '10px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '10px' }}>{u.name}</td>
                    <td style={{ padding: '10px' }}>{u.email}</td>
                    <td style={{ padding: '10px', textTransform: 'capitalize' }}>{u.role}</td>
                    <td style={{ padding: '10px' }}>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => deleteUser(u)}
                        disabled={deletingUsers[u.id]}
                      >
                        {deletingUsers[u.id] ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <h3>Farmers Purchases</h3>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>
                <th style={{ padding: '10px' }}>Farmer Aadhar</th>
                <th style={{ padding: '10px' }}>Product</th>
                <th style={{ padding: '10px' }}>Quantity</th>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {farmerTable.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '10px' }}>{row.farmerAadhar || '-'}</td>
                  <td style={{ padding: '10px' }}>
                    {row.productName || '-'}
                    {row.isDeleted && <span style={{ color: '#dc3545', marginLeft: '8px', fontSize: '0.85rem' }}>(Deleted)</span>}
                  </td>
                  <td style={{ padding: '10px' }}>{row.quantity ?? '-'}</td>
                  <td style={{ padding: '10px' }}>{formatIST(row.date)}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{currency(row.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Shop Sales</h3>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>
                <th style={{ padding: '10px' }}>Shop</th>
                <th style={{ padding: '10px' }}>Sold Product</th>
                <th style={{ padding: '10px' }}>Sold To (Aadhar)</th>
                <th style={{ padding: '10px' }}>Quantity</th>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {shopTable.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '10px' }}>{row.shopName || '-'}</td>
                  <td style={{ padding: '10px' }}>
                    {row.soldProduct || '-'}
                    {row.isDeleted && <span style={{ color: '#dc3545', marginLeft: '8px', fontSize: '0.85rem' }}>(Deleted)</span>}
                  </td>
                  <td style={{ padding: '10px' }}>{row.soldToFarmerAadhar || '-'}</td>
                  <td style={{ padding: '10px' }}>{row.quantity ?? '-'}</td>
                  <td style={{ padding: '10px' }}>{formatIST(row.date)}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{currency(row.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
