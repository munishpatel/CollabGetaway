import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Create this CSS file

export default function HomePage() {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleStart = () => setShowInput(true);

  const handleSubmit = () => {
    if (name.trim()) {
      localStorage.setItem("collabUserName", name);
      navigate('/dashboard');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="logo">CollabGetaway</div>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <h1 className="title">CollabGetaway</h1>
          <p className="subtitle">Design your dream vacation with friends/family in real-time</p>
          
          {!showInput ? (
            <button className="cta-button" onClick={handleStart}>
              Begin Your Journey
            </button>
          ) : (
            <div className="name-input-container">
              <input
                type="text"
                placeholder="Enter your name"
                className="name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={!name.trim()}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} CollabGetaway. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}