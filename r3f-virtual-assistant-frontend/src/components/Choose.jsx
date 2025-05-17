import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUsers, FaHome } from "react-icons/fa";

export default function Choose() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const beepRef = useRef(null);

  const playBeep = () => {
    if (beepRef.current) {
      beepRef.current.currentTime = 0;
      beepRef.current.play();
    }
  };

  const steps = [
    { label: "Student", icon: <FaUser />, path: "/instructions", base: "#ffdfe0", hover: "#ffb3b3" },
    { label: "Class", icon: <FaUsers />, path: "/instructions", base: "#e0f7fa", hover: "#a3eaff" },
    { label: "Homeschooler", icon: <FaHome />, path: "/instructions", base: "#e0ffe0", hover: "#80ff80" },
  ];

  return (
    <div className="page-container" style={{ padding: "40px 20px", position: "relative" }}>
      {/* Preloaded beep sound */}
      <audio ref={beepRef} src="/beep.mp3" preload="auto" />

      {/* Top-right navigation */}
      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: "10px" }}>
        <button
          onClick={() => {
            playBeep();
            navigate(-1);
          }}
          onMouseEnter={() => setHoveredBtn("back")}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            ...navBtnStyle,
            ...(hoveredBtn === "back" ? hoveredStyle : {})
          }}
        >
          Back
        </button>

        <button
          onClick={() => {
            playBeep();
            navigate("/instructions");
          }}
          onMouseEnter={() => setHoveredBtn("next")}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            ...navBtnStyle,
            backgroundColor: "#28a745",
            ...(hoveredBtn === "next" ? hoveredStyle : {})
          }}
        >
          Next
        </button>

        <button
          onClick={() => {
            playBeep();
            alert("If you need help, ask your teacher or click instructions.");
          }}
          onMouseEnter={() => setHoveredBtn("help")}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            ...navBtnStyle,
            backgroundColor: "#dc3545",
            ...(hoveredBtn === "help" ? hoveredStyle : {})
          }}
        >
          Help
        </button>
      </div>

      {/* Title */}
      <div style={titleStyle}>
        Are you a student, in a class, or a homeschooler?
      </div>

      {/* Option Cards */}
      <div style={cardsContainer}>
        {steps.map((step, idx) => (
          <div
            key={step.label}
            onClick={() => {
              playBeep();
              navigate(step.path);
            }}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            style={{
              ...cardStyle,
              backgroundColor: hovered === idx ? step.hover : step.base,
              transition: "background-color 0.15s ease, transform 0.15s ease",
              transform: hovered === idx ? "scale(1.05)" : "scale(1)"
            }}
          >
            <div style={iconStyle}>{step.icon}</div>
            <div>{step.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          playBeep();
          navigate("/instructions");
        }}
        style={quizBtnStyle}
        onMouseEnter={() => setHoveredBtn("quiz")}
        onMouseLeave={() => setHoveredBtn(null)}
      >
        Take Pre-Quiz 📝
      </button>
    </div>
  );
}

// Base button style
const navBtnStyle = {
  padding: "8px 16px",
  backgroundColor: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.2s, color 0.2s"
};

// Black rollover
const hoveredStyle = {
  backgroundColor: "#000",
  color: "#fff"
};

const titleStyle = {
  textAlign: "center",
  fontSize: "3em",
  fontWeight: "bold",
  marginBottom: "20px"
};

const cardsContainer = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignContent: "center",
  gap: "20px",
  width: "100%",
  maxWidth: "2000px",
  height: "calc(100vh - 180px)",
  margin: "0 auto"
};

const cardStyle = {
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  flex: "0 0 30%",
  height: "400px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "#2c3e50",
  fontWeight: "600",
  padding: "0 10px",
  fontSize: "2em",
  cursor: "pointer"
};

const iconStyle = {
  fontSize: "2.5em",
  marginBottom: "10px"
};

const quizBtnStyle = {
  marginTop: "20px",
  padding: "50px 24px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "1em",
  transition: "background-color 0.2s, color 0.2s"
};
