// src/components/Prequiz.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGLTF } from "@react-three/drei";

// Preload the avatar model so it’s cached before navigation
useGLTF.preload("/models/Idle.glb");

export default function Prequiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    { text: "1. Which structure pulls on joints to close the hand?", options: ["A. Tendons", "B. Ligaments", "C. Cartilage", "D. Blood vessels"], name: "q1" },
    { text: "2. Which is NOT a part of the human hand?", options: ["A. Carpals", "B. Tendons", "C. Metatarsals", "D. Phalanges"], name: "q2" },
    { text: "3. Building a skeletal hand model teaches principles of:", options: ["A. Robotics", "B. Quantum physics", "C. Astrology", "D. Oceanography"], name: "q3" },
    { text: "4. Joints are classified as:", options: ["A. Pivot, Hinge, Ball-and-socket", "B. Laser, Lens, Light", "C. Hydraulic, Pneumatic, Electric", "D. None of these"], name: "q4" },
    { text: "5. Studying muscle mechanics can lead to careers in:", options: ["A. Biomechanical engineering", "B. Fashion design", "C. Graphic arts", "D. Philosophy"], name: "q5" },
    { text: "6. Which field applies hand biomechanics to robotics?", options: ["A. Prosthetics design", "B. Marine biology", "C. Sociology", "D. Linguistics"], name: "q6" },
    { text: "7. Tendons connect muscle to _____?", options: ["A. Bone", "B. Skin", "C. Nerve", "D. Cartilage"], name: "q7" },
    { text: "8. A hinge joint primarily allows movement in how many axes?", options: ["A. One", "B. Two", "C. Three", "D. Multiple"], name: "q8" },
  ];

  const q = questions[currentQuestion];
  const selected = answers[q.name];
  const isLast = currentQuestion === questions.length - 1;

  const handleSelect = (letter) => {
    setAnswers(prev => ({ ...prev, [q.name]: letter }));
  };

  const handleNext = () => {
    if (isLast) {
      console.log("All answers:", answers);
      navigate("/postquiz");
    } else {
      setCurrentQuestion(cur => cur + 1);
    }
  };

  return (
    <div style={container}>
      <h2 style={heading}>{q.text}</h2>

      <div style={buttonGrid}>
        {q.options.map((opt, i) => {
          const letter = opt[0];
          const isSel = selected === letter;
          return (
            <button
              key={i}
              onClick={() => handleSelect(letter)}
              style={{
                ...quizBtn,
                backgroundColor: ["#cc4c4c", "#3a72b1", "#d4893b", "#3aaf8f"][i % 4],
                position: "relative",
                opacity: isSel ? 1 : 0.9,
              }}
            >
              {isSel && <span style={checkmark}>✓</span>}
              {opt}
            </button>
          );
        })}
      </div>

      {selected && (
        <button
          onClick={handleNext}
          style={largeNextBtn}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#5a6268")}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = "#6c757d")}
        >
          Next Question&nbsp;→
        </button>
      )}
    </div>
  );
}

// Styles
const container = {
  padding: "40px 20px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100vh",
  justifyContent: "center",
};

const heading = {
  fontSize: "2.2em",
  fontWeight: "bold",
  marginBottom: "30px",
};

const buttonGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(360px, 1fr))",
  gap: "30px",
  marginBottom: "40px",
};

const quizBtn = {
  minWidth: "360px",
  height: "220px",
  padding: "40px",
  fontSize: "2em",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "opacity 0.2s ease",
};

const checkmark = {
  position: "absolute",
  top: "8px",
  left: "8px",
  fontSize: "1.2em",
  color: "#fff",
};

const largeNextBtn = {
  padding: "20px 60px",
  fontSize: "1.8em",
  backgroundColor: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};
