import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Instructions() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleMouseDown = (button) => setActiveButton(button);
  const handleMouseUp = () => setActiveButton(null);

  const handleMouseEnter = (button) => setHoveredButton(button);
  const handleMouseLeave = () => {
    setHoveredButton(null);
    setActiveButton(null);
  };

  const buttonStyle = (baseColor, id) => ({
    padding: '10px 20px',
    backgroundColor: hoveredButton === id ? '#000' : baseColor,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transform: activeButton === id ? 'scale(0.96)' : 'scale(1)',
    transition: 'all 0.2s ease',
    margin: '0 10px'
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
      <h2 className="text-4xl font-bold mb-6">
        How to Use Amanda CMS
      </h2>

      <ol className="list-decimal pl-8 mb-8 space-y-2 text-left max-w-md mx-auto text-xl">
        <li>Click “Get Started” on the landing page.</li>
        <li>Follow on-screen prompts to build your DIY project.</li>
        <li>Use the chat widget to ask questions in real time.</li>
        <li>Take the pre- and post-tests to assess your learning.</li>
      </ol>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate(-1)}
          onMouseDown={() => handleMouseDown('back')}
          onMouseUp={handleMouseUp}
          onMouseEnter={() => handleMouseEnter('back')}
          onMouseLeave={handleMouseLeave}
          style={buttonStyle('#007bff', 'back')}
        >
          ← Back
        </button>

        <button
          onClick={() => navigate('/preview')}
          onMouseDown={() => handleMouseDown('next')}
          onMouseUp={handleMouseUp}
          onMouseEnter={() => handleMouseEnter('next')}
          onMouseLeave={handleMouseLeave}
          style={buttonStyle('#28a745', 'next')}
        >
          Go to Preview →
        </button>

        <button
          onClick={() => navigate('/')}
          onMouseDown={() => handleMouseDown('skip')}
          onMouseUp={handleMouseUp}
          onMouseEnter={() => handleMouseEnter('skip')}
          onMouseLeave={handleMouseLeave}
          style={buttonStyle('#8B4513', 'skip')} // brown
        >
          Skip →
        </button>
      </div>
    </div>
  );
}
