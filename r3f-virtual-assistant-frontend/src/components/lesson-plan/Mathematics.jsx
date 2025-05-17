// src/components/Mathematics.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Mathematics() {
  const navigate = useNavigate();

  return (
    <div style={pageContainer}>
      <h1 style={title}>Mathematics Lesson Plan</h1>
      <p style={intro}>
        Welcome to your customized mathematics journey! These lessons will challenge your
        logic and numerical skills.
      </p>

      {/* Example modules */}
      <ul style={moduleList}>
        <li><strong>Module 1:</strong> Number Patterns<br/>Explore sequences and create your own number series.</li>
        <li><strong>Module 2:</strong> Geometry Constructions<br/>Use compass and straightedge to construct shapes and angles.</li>
        <li><strong>Module 3:</strong> Data Analysis<br/>Collect sample data and compute mean, median, and mode.</li>
        <li><strong>Module 4:</strong> Cryptography Basics<br/>Learn simple ciphers and encode/decode messages.</li>
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
  backgroundColor: "#9013fe",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};