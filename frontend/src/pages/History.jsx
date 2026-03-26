import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/predict/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setHistory(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '2rem' }}>Analysis History</h2>
      
      {loading ? (
        <div>Loading history...</div>
      ) : history.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ color: 'var(--text-muted)' }}>No analysis history found.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item) => (
            <div key={item.id} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 1.5rem' }}>
              <img 
                src={item.image_url} 
                alt="Scan" 
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {new Date(item.timestamp).toLocaleString()}
                </div>
                <div style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 600, 
                  color: item.prediction === 'Malignant' ? 'var(--danger)' : 'var(--success)',
                  marginTop: '0.25rem'
                }}>
                  {item.prediction} ({item.confidence}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryScreen;
