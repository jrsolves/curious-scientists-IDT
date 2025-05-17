// src/components/Instructions.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Instructions() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);

  const handleMouseDown = (button) => setActiveButton(button);
  const handleMouseUp = () => setActiveButton(null);

  const buttonStyle = (color, id) => ({
    padding: '10px 20px',
    backgroundColor: color,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transform: activeButton === id ? 'scale(0.96)' : 'scale(1)',
    transition: 'transform 0.1s ease-in-out',
    margin: '0 10px'
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100vh',
        padding: '0 20px'
      }}
    >
      <h2 style={{ fontSize: '2.5em', fontWeight: 'bold', marginBottom: '20px' }}>
        How to Use Amanda CMS
      </h2>

      <ol
        style={{
          listStyleType: 'decimal',
          margin: '0 auto 40px',
          maxWidth: '600px',
          textAlign: 'center',
          lineHeight: '1.6'
        }}
      >
        <li style={{ margin: '10px 0' }}>Click “Get Started” on the landing page.</li>
        <li style={{ margin: '10px 0' }}>Follow on-screen prompts to build your DIY project.</li>
        <li style={{ margin: '10px 0' }}>Use the chat widget to ask questions in real time.</li>
        <li style={{ margin: '10px 0' }}>Take the pre- and post-tests to assess your learning.</li>
      </ol>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={() => navigate(-1)}
          onMouseDown={() => handleMouseDown('back')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={buttonStyle('#007bff', 'back')}
        >
          ← Back
        </button>

        <button
          onClick={() => navigate('/preview')}
          onMouseDown={() => handleMouseDown('next')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={buttonStyle('#28a745', 'next')}
        >
          Go to Preview →
        </button>
      </div>
    </div>
  );
}
