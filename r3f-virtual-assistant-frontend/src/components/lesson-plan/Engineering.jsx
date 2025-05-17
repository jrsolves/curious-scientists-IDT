// src/components/Engineering.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Engineering() {
  const navigate = useNavigate();

  return (
    <div style={pageContainer}>
      <h1 style={title}>Engineering Lesson Plan</h1>
      <p style={intro}>
        Welcome to your personalized engineering workshop! These modules will
        engage your problem-solving and design skills.
      </p>

      {/* Example modules */}
      <ul style={moduleList}>
        <li><strong>Module 1:</strong> Water Rocket Challenge<br/>Design and launch a bottle rocket and optimize for altitude.</li>
        <li><strong>Module 2:</strong> Bridge Building<br/>Use popsicle sticks to engineer a bridge that holds maximum weight.</li>
        <li><strong>Module 3:</strong> Robotics Arm Prototype<br/>Assemble and program a simple robotic arm using servos.</li>
        <li><strong>Module 4:</strong> 3D Design Basics<br/>Learn CAD fundamentals and 3D-print your own model component.</li>
      </ul>

      <button onClick={() => navigate(-1)} style={backBtn}>
        ← Back
      </button>
    </div>
  );
}

// Styles
const pageContainer = {
  padding: "40px 20px",
  maxWidth: "800px",
  margin: "0 auto",
  textAlign: "center",
  fontFamily: "Segoe UI, sans-serif",
  color: "#2c3e50",
};
const title = {
  fontSize: "3em",
  marginBottom: "20px",
};
const intro = {
  fontSize: "1.2em",
  marginBottom: "30px",
  lineHeight: 1.5,
};
const moduleList = {
  textAlign: "left",
  fontSize: "1.1em",
  marginBottom: "40px",
};
const backBtn = {
  padding: "10px 20px",
  fontSize: "1em",
  backgroundColor: "#f5a623",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
