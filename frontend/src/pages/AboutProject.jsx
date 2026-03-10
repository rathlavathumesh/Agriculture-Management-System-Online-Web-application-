import React from 'react'

export default function AboutProject() {
  return (
    <div className="page">
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ textAlign: 'center', color: '#2d5a27', marginBottom: '40px' }}>About Agriculture Management System</h1>
        
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h2 style={{ color: '#2d5a27', marginBottom: '20px' }}>🌱 Project Overview</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px' }}>
            The Agriculture Management System (AMS) is a comprehensive digital platform designed to modernize 
            agricultural practices and streamline the connection between farmers, shop owners, and agricultural 
            product suppliers. Our system aims to bridge the gap between traditional farming methods and 
            modern technology, making agricultural resources more accessible and manageable.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            Built with cutting-edge web technologies, AMS provides a user-friendly interface that caters to 
            different stakeholders in the agricultural ecosystem, ensuring efficient product management, 
            seamless transactions, and data-driven decision making.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>🎯 Mission</h3>
            <p style={{ lineHeight: '1.6' }}>
              To revolutionize agriculture by providing farmers with easy access to quality products, 
              modern farming techniques, and comprehensive crop management tools while enabling 
              shop owners to efficiently manage their agricultural inventory.
            </p>
          </div>
          
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>💡 Vision</h3>
            <p style={{ lineHeight: '1.6' }}>
              To become the leading digital platform that transforms traditional agriculture into 
              a smart, efficient, and sustainable ecosystem that benefits all stakeholders 
              in the agricultural value chain.
            </p>
          </div>
        </div>

        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h2 style={{ color: '#2d5a27', marginBottom: '30px' }}>🚀 Key Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ color: '#2d5a27', marginBottom: '10px' }}>👨‍🌾 For Farmers</h4>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>Browse and purchase agricultural products</li>
                <li>Track crop planting and harvest dates</li>
                <li>Monitor purchase history and expenses</li>
                <li>Access farming advice and resources</li>
              </ul>
            </div>
            
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ color: '#2d5a27', marginBottom: '10px' }}>🏪 For Shop Owners</h4>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>Manage product inventory</li>
                <li>Track sales and revenue</li>
                <li>Add and update product information</li>
                <li>Monitor customer purchase patterns</li>
              </ul>
            </div>
            
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ color: '#2d5a27', marginBottom: '10px' }}>👨‍💼 For Administrators</h4>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>Oversee entire system operations</li>
                <li>Generate comprehensive reports</li>
                <li>Manage user accounts and permissions</li>
                <li>Monitor system performance and analytics</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h2 style={{ color: '#2d5a27', marginBottom: '30px' }}>🛠️ Technology Stack</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚛️</div>
              <h4>React.js</h4>
              <p style={{ color: '#6c757d' }}>Frontend Framework</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🟢</div>
              <h4>Node.js</h4>
              <p style={{ color: '#6c757d' }}>Backend Runtime</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🗄️</div>
              <h4>SQLite</h4>
              <p style={{ color: '#6c757d' }}>Database</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔐</div>
              <h4>JWT</h4>
              <p style={{ color: '#6c757d' }}>Authentication</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #4a7c59, #6b9b6b)', color: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>🌍 Impact & Benefits</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '30px' }}>
            Our Agriculture Management System is designed to make a positive impact on the agricultural 
            community by improving efficiency, reducing waste, and connecting stakeholders in meaningful ways.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <h4>📈 Increased Efficiency</h4>
              <p>Streamlined processes and better resource management</p>
            </div>
            <div>
              <h4>💰 Cost Reduction</h4>
              <p>Better pricing and reduced middleman costs</p>
            </div>
            <div>
              <h4>🌱 Sustainable Farming</h4>
              <p>Promoting eco-friendly agricultural practices</p>
            </div>
            <div>
              <h4>📊 Data-Driven Decisions</h4>
              <p>Analytics and insights for better farming choices</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginTop: '30px' }}>
          <h2 style={{ color: '#2d5a27', marginBottom: '20px', textAlign: 'center' }}>📬 Contact</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ border: '1px solid #e9ecef', borderRadius: '10px', padding: '20px' }}>
              <h3 style={{ marginBottom: '8px', color: '#2d5a27' }}>Rathlavath Umesh</h3>
              <div style={{ color: '#6c757d', marginBottom: '10px' }}>Computer Science and Engineering</div>
              <div style={{ color: '#6c757d', marginBottom: '16px' }}>Indian Institute of Information Technology, Design and Manufacturing, Kurnool</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a href="https://www.linkedin.com/in/rathlavath-umesh-973978372/" target="_blank" rel="noreferrer" className="btn btn-primary">LinkedIn</a>
                <a href="mailto:rathlavathumesh374@gmail.com" className="btn btn-primary">Email</a>
              </div>
            </div>
            <div style={{ border: '1px solid #e9ecef', borderRadius: '10px', padding: '20px' }}>
              <h3 style={{ marginBottom: '8px', color: '#2d5a27' }}>Siripurapu Harish</h3>
              <div style={{ color: '#6c757d', marginBottom: '10px' }}>Computer Science and Engineering</div>
              <div style={{ color: '#6c757d', marginBottom: '16px' }}>Indian Institute of Information Technology, Design and Manufacturing, Kurnool</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a href="https://www.linkedin.com/in/harish-siripurapu-a92428310/" target="_blank" rel="noreferrer" className="btn btn-primary">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

