import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ResetPassword() {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { otp, password });
      navigate('/login');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
            placeholder="Enter the OTP you received"
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Enter your new password"
          />
        </div>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
