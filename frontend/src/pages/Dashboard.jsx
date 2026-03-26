import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Activity, ShieldAlert, CheckCircle, Info, Stethoscope, FileText } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/predict/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setResult(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (prediction, confidence) => {
    if (prediction === 'Malignant') {
      return { level: 'High', color: 'var(--danger)', icon: ShieldAlert, severity: 'CRITICAL' };
    }
    if (confidence < 90) {
      return { level: 'Medium', color: 'var(--warning)', icon: Activity, severity: 'EVALUATE' };
    }
    return { level: 'Low', color: 'var(--success)', icon: CheckCircle, severity: 'ROUTINE' };
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      
      {/* LEFT COLUMN - Main Diagnostic Tool */}
      <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-panel">
          <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Stethoscope color="var(--primary)" /> Clinical Analysis Engine
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Upload clear, well-lit dermatoscopic imagery for rapid CNN-based lesion screening.
          </p>
          
          <div 
            style={{ 
              border: '2px dashed var(--glass-border)', 
              borderRadius: '12px', 
              padding: '3rem 2rem', 
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
              background: 'rgba(15, 23, 42, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}
            onClick={() => document.getElementById('file-upload').click()}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
          >
            <input 
              type="file" 
              id="file-upload" 
              style={{ display: 'none' }} 
              accept="image/jpeg, image/png" 
              onChange={handleFileChange}
            />
            {preview ? (
              <img src={preview} alt="Scan Preview" style={{ maxWidth: '100%', maxHeight: '350px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} />
            ) : (
              <>
                <UploadCloud size={56} color="var(--primary)" />
                <div style={{ color: 'var(--text-muted)' }}>Click to select a local Image File (JPG/PNG)</div>
              </>
            )}
          </div>
          
          {error && <div className="medical-disclaimer">{error}</div>}
          
          <button 
            className="btn-primary" 
            onClick={handleUpload} 
            disabled={!file || loading}
            style={{ width: '100%', opacity: (!file || loading) ? 0.5 : 1, padding: '14px', fontSize: '1.05rem' }}
          >
            {loading ? 'Processing Neural Network Inference...' : 'Execute AI Analysis'}
          </button>
        </div>

        {result && (
          <div className="glass-panel" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20}/> Diagnostic Report
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Classification</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: result.prediction === 'Malignant' ? 'var(--danger)' : 'var(--success)' }}>
                  {result.prediction}
                </div>
              </div>
              
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Confidence Model</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                  {result.confidence}%
                </div>
              </div>
              
              {(() => {
                const risk = getRiskLevel(result.prediction, result.confidence);
                const Icon = risk.icon;
                return (
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', border: `1px solid ${risk.color}40` }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Risk Assessment</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: risk.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Icon size={24} />
                      {risk.level}
                    </div>
                  </div>
                );
              })()}
            </div>
            
            <div className="medical-disclaimer" style={{ marginTop: '2rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Info size={24} style={{ flexShrink: 0, marginTop: '2px' }}/>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>MEDICAL DISCLAIMER:</strong> 
                This assessment is generated by an artificial intelligence screening tool and does not constitute a definitive medical diagnosis. A biopsy performed by a certified dermatologist is strictly required for clinical diagnosis.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN - Medical Guidelines */}
      <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-panel" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} color="var(--warning)"/> The ABCDE Rule of Melanoma
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}><strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>A - Asymmetry</strong> One half of the mole or lesion does not match the other.</li>
            <li style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}><strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>B - Border</strong> Edges are irregular, ragged, notched, or blurred.</li>
            <li style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}><strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>C - Color</strong> The color varies throughout the lesion, containing shades of black, brown, red, or blue.</li>
            <li style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}><strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>D - Diameter</strong> The spot is larger than 6 millimeters across (about the size of a pencil eraser).</li>
            <li style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}><strong style={{ color: 'var(--warning)', display: 'block', marginBottom: '4px' }}>E - Evolving</strong> The mole is changing rapidly in size, shape, color, or elevation.</li>
          </ul>
        </div>
        
        <div className="glass-panel" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>System Architecture Metrics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.9rem' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Primary Model</div>
              <div style={{ fontWeight: 600, marginTop: '4px' }}>MobileNetV2 CNN</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Training Corpus</div>
              <div style={{ fontWeight: 600, marginTop: '4px' }}>HAM10000 Registry</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Target Val Acc.</div>
              <div style={{ fontWeight: 600, marginTop: '4px', color: 'var(--success)' }}>~85.2%</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Avg Inference Latency</div>
              <div style={{ fontWeight: 600, marginTop: '4px' }}>150ms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
