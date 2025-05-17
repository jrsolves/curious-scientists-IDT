import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaQuestionCircle,
  FaAward,
  FaClipboardCheck,
  FaStar,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";

export default function Preview() {
  const navigate = useNavigate();
  const [pulseIndex, setPulseIndex] = useState(-1);
  const [lockedSteps, setLockedSteps] = useState([]);
  const [buttonBlink, setButtonBlink] = useState(false);
  const [buttonPulse, setButtonPulse] = useState(false);

  const steps = [
    { label: "Introduction & Objectives", icon: <FaBook /> },
    { label: "Essential Learning Quizzes", icon: <FaQuestionCircle /> },
    { label: "Build Amazing Projects and Earn Badges!", icon: <FaAward /> },
    { label: "Post Quiz", icon: <FaClipboardCheck /> },
    { label: "Evaluation", icon: <FaStar /> },
    { label: "Conclusion", icon: <FaCheckCircle /> }
  ];

  const baseColors = ["#ffdfe0", "#e0f7fa", "#fff3e0", "#e8f5e9", "#f3e5f5", "#e1f5fe"];
  const hoverColors = ["#ff4d4d", "#004d4d", "#ff8c00", "#006400", "#800080", "#00008b"];

  // Sequential card pulse and lock
  useEffect(() => {
    let i = 0;
    const pulse = setInterval(() => {
      if (i < steps.length) {
        setPulseIndex(i);
        setTimeout(() => {
          setLockedSteps((prev) => [...prev, i]);
          setPulseIndex(-1);
        }, 1200); // Extended pulse duration
        i++;
      } else {
        clearInterval(pulse);
        // Begin pulsing final button
        setTimeout(() => {
          setInterval(() => {
            setButtonBlink((prev) => !prev);
            setButtonPulse((prev) => !prev);
          }, 500);
        }, 600);
      }
    }, 1300); // Adjusted to match pulse display
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <h2 style={{ fontSize: "3em", textAlign: "center", marginTop: "20px" }}>Preview</h2>
      <p style={{ fontSize: "2em", textAlign: "center", margin: "20px 0 40px" }}>
        Here's an overview of the steps you'll go through:
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {steps.map((step, idx) => {
          const isPulsing = pulseIndex === idx;
          const isLocked = lockedSteps.includes(idx);
          const bgColor = isPulsing ? hoverColors[idx] : baseColors[idx];
          const textColor = isPulsing ? "#fff" : "#2c3e50";

          return (
            <div
              key={step.label}
              onClick={() => navigate("/prequiz")}
              style={{
                backgroundColor: bgColor,
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                flex: "0 0 28%",
                height: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: textColor,
                fontWeight: "600",
                padding: "0 10px",
                fontSize: "1.2em",
                cursor: "pointer",
                transform: isPulsing ? "scale(1.12)" : "scale(1)",
                transition: "all 0.4s ease-in-out",
                pointerEvents: isLocked ? "none" : "auto"
              }}
            >
              <div style={{ fontSize: "2em", marginBottom: "10px" }}>
                {step.icon}
              </div>
              <div>{step.label}</div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/interests-survey")}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: "20px 40px",
          backgroundColor: buttonBlink ? '#00008b' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1.2em',
          transform: buttonPulse ? 'scale(1.08)' : 'scale(1)',
          transition: 'all 0.3s ease-in-out',
          margin: '60px 0'
        }}
      >
        Find out what kind of Curious Scientist you are!
        <FaArrowRight
          style={{
            fontSize: buttonPulse ? '3em' : '1.5em',
            transition: 'font-size 0.3s ease-in-out'
          }}
        />
      </button>
    </div>
  );
}
