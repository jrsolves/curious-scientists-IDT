import React from 'react';
import { Button } from '/src/components/ui/Button.jsx';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white p-8">
      <h1 className="text-5xl font-extrabold mb-4">Welcome to Amanda CMS</h1>
      <p className="text-lg text-gray-700 mb-6">
        Your interactive STEM education hub powered by Amanda, the AI tutor.
      </p>
      <Button size="lg" onClick={() => navigate('/app')}>
        Get Started
      </Button>
    </div>
  );
}
