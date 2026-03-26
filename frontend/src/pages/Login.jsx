import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/auth/login`, {
          username: formData.username,
          password: formData.password
        });
        localStorage.setItem('token', res.data.access_token);
        navigate('/dashboard');
        window.location.reload();
      } else {
        const res = await axios.post(`${API_URL}/auth/register`, {
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data.access_token);
        navigate('/dashboard');
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', marginTop: '10vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      
      {error && <div className="medical-disclaimer" style={{ background: 'rgba(239,68,68,0.2)' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Username</label>
          <input 
            type="text" 
            className="input-field" 
            required 
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>
        
        {!isLogin && (
          <div className="input-group">
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email</label>
            <input 
              type="email" 
              className="input-field" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        )}
        
        <div className="input-group">
          <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
          <input 
            type="password" 
            className="input-field" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        
        <button type="submit" className="btn-primary">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </span>
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
        >
          {isLogin ? 'Sign up' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
