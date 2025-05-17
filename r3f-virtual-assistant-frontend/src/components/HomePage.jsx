import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import groupImage from "../assets/group.jpg";        // adjust if path differs
import curiousLogo from "../assets/curious_logo.png"; // your transparent logo

export default function HomePage() {
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "skyblue",
        fontFamily: "Segoe UI, sans-serif",
        color: "#ffffff",
        textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
        padding: "0 20px",
        textAlign: "center"
      }}
    >
      {/* Logo replaces heading */}
      <img
        src={curiousLogo}
        alt="Curious Scientists Logo"
        style={{
          width: "700px",
          maxWidth: "100%",
          height: "auto",
          marginBottom: "10px"
        }}
      />

      {/* Series label in its own div */}
      <div
        style={{
          fontSize: "3em",
          fontWeight: "bold",
          marginTop: "-20px",
          marginBottom: "30px",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
        }}
      >
        Series
      </div>

      {/* Centered group image */}
      <img
        src={groupImage}
        alt="Curious Scientists Group"
        style={{
          width: "800px",
          maxWidth: "100%",
          height: "auto",
          borderRadius: "12px",
          marginBottom: "30px",
          boxShadow: "0 6px 12px rgba(0,0,0,0.2)"
        }}
      />

      <p
        style={{
          fontSize: "1.2em",
          maxWidth: "600px",
          marginBottom: "40px",
          lineHeight: "1.4"
        }}
      >
        Kids! Dive into interactive science, technology, engineering, and Mathematic adventures designed to spark your curiosity
        and enhance your understanding of the world around you!
      </p>

      <button
        onClick={() => navigate("/choose")}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          padding: "14px 28px",
          fontSize: ".8em",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#0056b3",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          transform: isPressed ? "scale(0.98)" : "scale(1)",
          transition: "transform 0.1s ease-in-out"
        }}
      >
        Get Started
      </button>
    </div>
  );
}
