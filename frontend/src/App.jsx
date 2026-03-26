import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HistoryScreen from './pages/History';
import Chatbot from './components/Chatbot';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="app-container">
        <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column' }}>
          <nav className="nav-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '8px' }}></div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Skin Detection AI</h2>
            </div>
            <div className="nav-links">
              {token ? (
                <>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/history">History</Link>
                  <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '1.5rem', fontSize: '1rem' }}>Logout</button>
                </>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </div>
          </nav>
          
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/history" element={token ? <HistoryScreen /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
