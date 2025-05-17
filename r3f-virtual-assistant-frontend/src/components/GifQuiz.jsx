import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGLTF } from "@react-three/drei";

useGLTF.preload("/models/Idle.glb");

export default function GifQuiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const rawQuestions = [
    {
      text: "1. What are in between the bones that bend when pulled by tendons?",
      correct: "Joints",
      correctExplanation: "Correct! Joints are the flexible connections between bones that allow bending and movement.",
      feedback: {
        "Muscles": "Muscles contract to pull tendons, but they are not between bones.",
        "Veins": "Veins transport blood and have nothing to do with bending.",
        "Ligaments": "Ligaments connect bones to bones, but they don't create bending motion."
      },
      options: ["Joints", "Muscles", "Veins", "Ligaments"],
      name: "q1"
    },
    {
      text: "2. What connects muscles to bones in the human body?",
      correct: "Tendons",
      correctExplanation: "That's right! Tendons are strong connective tissues that attach muscles to bones, helping you move.",
      feedback: {
        "Cartilage": "Cartilage cushions joints but does not connect muscle to bone.",
        "Blood vessels": "Blood vessels carry nutrients, not movement forces.",
        "Skin": "Skin protects the body but doesn’t connect internal structures."
      },
      options: ["Tendons", "Cartilage", "Blood vessels", "Skin"],
      name: "q2"
    },
    {
      text: "3. Which part of a DIY cardboard hand acts like tendons?",
      correct: "String",
      correctExplanation: "Yes! String in a cardboard hand mimics tendons by pulling to make fingers bend.",
      feedback: {
        "Glue": "Glue holds parts together but doesn't act like a pulling mechanism.",
        "Tape": "Tape can fasten pieces, but it doesn’t simulate tendon action.",
        "Paper": "Paper forms the structure but not the moving parts."
      },
      options: ["String", "Glue", "Tape", "Paper"],
      name: "q3"
    },
    {
      text: "4. Why do fingers curl when tendons are pulled?",
      correct: "Tendons pull across joints",
      correctExplanation: "Excellent! Tendons pull across joints, causing fingers to curl like real mechanical systems.",
      feedback: {
        "Air pushes bones together": "Air pressure doesn't move bones—muscles and tendons do.",
        "Bones expand": "Bones don’t expand to create motion.",
        "Muscles shorten bones": "Muscles don’t shorten bones—they pull tendons that move bones."
      },
      options: ["Tendons pull across joints", "Air pushes bones together", "Bones expand", "Muscles shorten bones"],
      name: "q4"
    }
  ];

  const questions = useMemo(() => {
    return rawQuestions.map((q) => {
      const shuffled = [...q.options].sort(() => Math.random() - 0.5);
      const options = shuffled.map((text, i) => ({
        label: String.fromCharCode(65 + i),
        text,
        isCorrect: text === q.correct
      }));
      return { ...q, options };
    });
  }, []);

  const q = questions[currentQuestion];
  const isLast = currentQuestion === questions.length - 1;

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt.label);
    setAnswers(prev => ({ ...prev, [q.name]: opt.label }));
    setShowFeedback(true);
    if (opt.isCorrect) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelected(null);
    if (isLast) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(cur => cur + 1);
    }
  };

  const renderFeedback = () => {
    if (!showFeedback || !selected) return null;
    const selectedOption = q.options.find(o => o.label === selected);
    if (selectedOption.isCorrect) {
      return <p style={feedbackCorrect}>✅ {q.correctExplanation}</p>;
    } else {
      return (
        <div style={feedbackWrong}>
          ❌ {q.feedback[selectedOption.text]}<br />
          ✅ The correct answer is <strong>{q.correct}</strong>.<br />
          Don't worry if you got that wrong! There are other chances to learn this.
        </div>
      );
    }
  };

  if (currentQuestion >= questions.length) {
    return (
      <div style={container}>
        <h2 style={{ fontSize: "2.5em", marginBottom: "1em" }}>🎉 Quiz Complete!</h2>
        <p style={{ fontSize: "1.5em" }}>
          You got <strong>{score}</strong> out of <strong>{questions.length}</strong> correct.
        </p>
        <button
          onClick={() => navigate("/avatar")}
          style={{ ...largeNextBtn, animation: "pulse 1.2s infinite" }}
        >
          Continue →
        </button>
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(0.8); opacity: 0.6; }
              50% { transform: scale(1.2); opacity: 1; }
              100% { transform: scale(0.8); opacity: 0.6; }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={container}>
      <h2 style={heading}>{q.text}</h2>
      <div style={buttonGrid}>
        {q.options.map((opt) => {
          const isSel = selected === opt.label;
          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt)}
              style={{
                ...quizBtn,
                backgroundColor: ["#cc4c4c", "#3a72b1", "#d4893b", "#3aaf8f"][opt.label.charCodeAt(0) % 4],
                opacity: selected && !isSel ? 0.5 : 1,
                border: isSel ? "3px solid #fff" : "none",
              }}
              disabled={!!selected}
            >
              {isSel && <span style={checkmark}>✓</span>}
              {opt.label}. {opt.text}
            </button>
          );
        })}
      </div>

      {renderFeedback()}

      {selected && (
        <button
          onClick={handleNext}
          style={{ ...largeNextBtn, animation: "pulse 1.2s infinite" }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#5a6268")}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = "#6c757d")}
        >
          {isLast ? "See Results →" : "Next Question →"}
        </button>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.6; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(0.8); opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
}

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
  marginBottom: "20px",
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
  position: "relative"
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
  marginTop: "20px"
};

const feedbackCorrect = {
  color: "green",
  fontSize: "1.5em",
  fontWeight: "bold",
  marginTop: "10px",
  lineHeight: "1.6",
};

const feedbackWrong = {
  color: "#cc0000",
  fontSize: "1.2em",
  marginTop: "10px",
  lineHeight: "1.6",
};
