// src/components/InterestsSurvey.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiVolcano } from "react-icons/gi";
import { FaGamepad, FaRocket, FaCalculator } from "react-icons/fa";

export default function InterestsSurvey() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      text: "1. Which activity sounds most fun?",
      options: ["science", "technology", "engineering", "mathematics"],
      labels: [
        "Build a homemade volcano",
        "Create a simple web game",
        "Design and test a water rocket",
        "Solve a set of math puzzles"
      ]
    },
    {
      text: "2. Which topic do you enjoy reading about?",
      options: ["science", "technology", "engineering", "mathematics"],
      labels: [
        "Astronomy and space",
        "Coding and apps",
        "Bridge and building design",
        "Number patterns and logic"
      ]
    },
    {
      text: "3. Which tool would you rather use?",
      options: ["science", "technology", "engineering", "mathematics"],
      labels: ["Microscope", "Computer", "Wrench and screwdriver", "Calculator"]
    },
    {
      text: "4. Which kind of project do you prefer?",
      options: ["science", "technology", "engineering", "mathematics"],
      labels: [
        "Chemistry experiments",
        "Building a website",
        "Constructing a model bridge",
        "Statistical data analysis"
      ]
    },
    {
      text: "5. Which role appeals to you in healthcare and sports medicine?",
      options: ["science", "technology", "engineering", "mathematics"],
      labels: [
        "Diagnose and treat athletes (Doctor/Nurse)",
        "Develop health-tracking apps",
        "Design prosthetics or sports gear",
        "Analyze sports performance statistics"
      ]
    },
    {
      text: "6. Where would you rather spend your free time?",
      options: ["science", "technology", "engineering", "mathematics"],
      labels: [
        "Visiting a science museum",
        "Playing a new mobile app",
        "Building a DIY gadget",
        "Solving a Sudoku puzzle"
      ]
    },
    {
      text: "7. What kind of problems do you like solving?",
      options: ["science", "technology", "engineering", "mathematics"],
      labels: [
        "Why plants grow toward light",
        "How algorithms work",
        "How bridges support weight",
        "Equations in financial models"
      ]
    },
    {
      text: "8. Which class did you enjoy most in school?",
      options: ["science", "technology", "engineering", "mathematics"],
      labels: ["Biology lab", "Computer science", "Shop or drafting", "Algebra"]
    },
    {
      text: "9. Which skill would you like to improve?",
      options: ["science", "technology", "engineering", "mathematics"],
      labels: [
        "Conducting experiments",
        "Writing code",
        "Using tools",
        "Statistical analysis"
      ]
    },
    {
      text: "10. How do you prefer to learn new concepts?",
      options: ["science", "technology", "engineering", "mathematics"],
      labels: [
        "Hands-on experiments",
        "Interactive tutorials",
        "Building physical models",
        "Working through problem sets"
      ]
    }
  ];

  const categoryColors = {
    science: "#4a90e2",
    technology: "#50e3c2",
    engineering: "#f5a623",
    mathematics: "#9013fe",
  };
  const hoverColors = {
    science: "#003f7f",
    technology: "#008f80",
    engineering: "#b5770d",
    mathematics: "#450a7f",
  };
  const icons = {
    science: <GiVolcano />,
    technology: <FaGamepad />,
    engineering: <FaRocket />,
    mathematics: <FaCalculator />,
  };

  const q = questions[current];
  const selected = answers[current];
  const isLast = current === questions.length - 1;

  const handleSelect = (opt) =>
    setAnswers((prev) => ({ ...prev, [current]: opt }));

  const handleNext = () => {
    if (!selected) return;
    if (isLast) {
      const tally = { science: 0, technology: 0, engineering: 0, mathematics: 0 };
      Object.values(answers).forEach((v) => tally[v]++);
      const top = Object.keys(tally).reduce((a, b) =>
        tally[a] > tally[b] ? a : b
      );
      navigate(`/lesson-plan/${top}`);
    } else {
      setCurrent((c) => c + 1);
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @media print {
          .interactive { display: none !important; }
          .print-only { display: block !important; }
          button { display: none !important; }
          .survey-container {
            display: block !important;
            height: auto !important;
            min-height: auto !important;
            justify-content: flex-start !important;
            flex-direction: unset !important;
          }
        }
      `}</style>

      {/* 🔴 Skip Survey Button (Top Left) */}
      <button
        onClick={() => navigate("/lesson-choose")}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 999,
          padding: "10px 22px",
          backgroundColor: "#dc3545",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1em",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
          animation: "pulse 1.4s infinite",
          transition: "all 0.3s ease-in-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.backgroundColor = "#fff";
          e.currentTarget.style.color = "#dc3545";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "#dc3545";
          e.currentTarget.style.color = "#fff";
        }}
      >
        Skip Survey →
      </button>

      {/* 🖨️ Print Survey Button (Top Right) */}
      <button
        onClick={() => window.print()}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "10px 22px",
          backgroundColor: "#343a40",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1em",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
          animation: "pulse 1.4s infinite",
          transition: "all 0.3s ease-in-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.backgroundColor = "#fff";
          e.currentTarget.style.color = "#343a40";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "#343a40";
          e.currentTarget.style.color = "#fff";
        }}
      >
        🖨️ Print Survey
      </button>

      <div className="survey-container" style={{ ...container, position: "relative" }}>
        {/* Interactive View */}
        <div className="interactive">
          <h2 style={heading}>{q.text}</h2>
          <div style={buttonGrid}>
            {q.options.map((opt, i) => {
              const base = categoryColors[opt];
              const hov = hoverColors[opt];
              const isSel = selected === opt;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hov;
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = base;
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.opacity = isSel ? "1" : "0.8";
                  }}
                  style={{ ...quizBtn, backgroundColor: base, opacity: isSel ? 1 : 0.8 }}
                >
                  {isSel && <span style={checkmark}>✓</span>}
                  <div>{q.labels[i]}</div>
                  <div style={{ marginTop: "10px", fontSize: "2em" }}>
                    {icons[opt]}
                  </div>
                </button>
              );
            })}
          </div>

          {selected && (
            <button onClick={handleNext} style={largeNextBtn}>
              {isLast ? "See Your Lesson →" : "Next Question →"}
            </button>
          )}
        </div>

        {/* Print View */}
        <div className="print-only" style={{ ...printOnly, fontSize: "0.9em" }}>
          <h1 style={{ ...printHeader, fontSize: "1.5em" }}>Interests Survey</h1>
          <div style={printInfo}>
            <span>Name: ____________________</span>
            <span style={{ marginLeft: "20px" }}>Class: ____________________</span>
            <span style={{ marginLeft: "20px" }}>Date: ____________________</span>
          </div>
          <p style={printDirections}>
            Choose the answer below. Note: there are no right answers!
          </p>
          {questions.map((qt, idx) => (
            <div
              key={idx}
              style={{
                ...printQuestion,
                pageBreakAfter: idx === 4 ? "always" : undefined,
              }}
            >
              <div>{qt.text}</div>
              <ol style={printList} type="A">
                {qt.labels.map((lbl, j) => (
                  <li key={j}>{lbl}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Base Styles
const container = {
  padding: "40px 20px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  justifyContent: "center",
};
const heading = { fontSize: "2.2em", fontWeight: "bold", marginBottom: 30 };
const buttonGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(300px, 1fr))",
  gap: 20,
  marginBottom: 40,
};
const quizBtn = {
  minWidth: 300,
  height: 220,
  padding: 20,
  fontSize: "1.5em",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  cursor: "pointer",
  position: "relative",
  transition: "all 0.2s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};
const checkmark = { position: "absolute", top: 8, left: 8, fontSize: "1.2em", color: "#fff" };
const largeNextBtn = {
  padding: "20px 50px",
  fontSize: "1.8em",
  backgroundColor: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};
const printOnly = { display: "none" };
const printHeader = { fontSize: "2em", marginBottom: 10 };
const printInfo = { marginBottom: 10 };
const printDirections = { marginBottom: 20 };
const printQuestion = { marginBottom: 20, textAlign: "left" };
const printList = { listStyleType: "circle", paddingLeft: 20, marginTop: 10 };
