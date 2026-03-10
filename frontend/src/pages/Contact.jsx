import React from 'react'

export default function Contact(){
  return (
    <div className="page">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ textAlign: 'center', color: '#2d5a27', marginBottom: '30px' }}>Contact Us</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'white', border: '1px solid #e9ecef', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '8px', color: '#2d5a27' }}>Rathlavath Umesh</h2>
            <div style={{ color: '#6c757d', marginBottom: '8px' }}>Computer Science and Engineering</div>
            <div style={{ color: '#6c757d', marginBottom: '16px' }}>Indian Institute of Information Technology, Design and Manufacturing, Kurnool</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a href="https://www.linkedin.com/in/rathlavath-umesh-973978372/" target="_blank" rel="noreferrer" className="btn btn-primary">LinkedIn</a>
              <a href="mailto:rathlavathumesh374@gmail.com" className="btn btn-primary">Email</a>
            </div>
          </div>
          <div style={{ background: 'white', border: '1px solid #e9ecef', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '8px', color: '#2d5a27' }}>Siripurapu Harish</h2>
            <div style={{ color: '#6c757d', marginBottom: '8px' }}>Computer Science and Engineering</div>
            <div style={{ color: '#6c757d', marginBottom: '16px' }}>Indian Institute of Information Technology, Design and Manufacturing, Kurnool</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a href="https://www.linkedin.com/in/harish-siripurapu-a92428310/" target="_blank" rel="noreferrer" className="btn btn-primary">LinkedIn</a>
              <a href="mailto:siripurapuharish04@gmail.com" className="btn btn-primary">Email</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
