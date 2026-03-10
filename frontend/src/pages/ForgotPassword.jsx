import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPassword() {
  const [aadhar, setAadhar] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { aadhar, phone });
      navigate('/reset-password');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Aadhar Card Number</label>
          <input
            type="text"
            value={aadhar}
            onChange={e => setAadhar(e.target.value)}
            required
            placeholder="Enter your Aadhar card number"
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            placeholder="Enter your phone number"
          />
        </div>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>
    </div>
  );
}
