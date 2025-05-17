// removed duplicate import to fix React redeclaration error
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import handbend from "../assets/handbend.gif";
import robotichand from "../assets/robotichand.gif";
import mainRobot from "../assets/main-robot.gif";

export default function HandTenonMech() {
  const navigate = useNavigate();
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showRobot, setShowRobot] = useState(false);
  const [showCardboard, setShowCardboard] = useState(false);

  const allShown = showSkeleton && showRobot && showCardboard;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      minHeight: "100vh",
      background: "#f0f0f0",
      padding: "2rem",
      justifyContent: "center"
    }}>
      <h1 style={{ fontSize: "3em", textAlign: "center", marginBottom: "2rem", color: "#2c3e50" }}>
        Let's learn how different hands work for different sciences and our cardboard hand project!
      </h1>

      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "40px",
        marginBottom: "2rem",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        flexGrow: 1
      }}>
        {!showSkeleton ? (
          <button onClick={() => setShowSkeleton(true)} style={{ ...selectBtn, backgroundColor: "#e74c3c" }}>
            See how a <strong>SKELETON</strong><br />hand works!
          </button>
        ) : (
          <div style={{ flex: 1, textAlign: "center", width: "33.33%", minWidth: "300px" }}>
            <img src={handbend} alt="Skeleton Hand" style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }} />
            <p style={{ ...textStyle, textAlign: "center", paddingRight: "60px" }}>
              Skeleton hand <strong>Tendons</strong><br />pull fingers by muscle!
            </p>
          </div>
        )}

        {!showRobot ? (
          <button onClick={() => setShowRobot(true)} style={{ ...selectBtn, backgroundColor: "#2980b9" }}>
            See how a <strong>ROBOTIC</strong><br />hand works!
          </button>
        ) : (
          <div style={{ flex: 1, textAlign: "center", width: "33.33%", minWidth: "300px" }}>
            <img src={robotichand} alt="Robotic Hand" style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }} />
            <p style={textStyle}>
              Robotic hand closes<br />fingers with <strong>Wires!</strong>
            </p>
          </div>
        )}

        {!showCardboard ? (
          <button onClick={() => setShowCardboard(true)} style={{ ...selectBtn, backgroundColor: "#27ae60" }}>
            See how a <strong>CARDBOARD</strong><br />model hand works!
          </button>
        ) : (
          <div style={{ flex: 1, textAlign: "center", width: "33.33%", minWidth: "300px" }}>
            <img src={mainRobot} alt="Cardboard Hand" style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }} />
            <p style={textStyle}>
              Cardboard Robot hand closes by pulling <strong>String!</strong>
            </p>
          </div>
        )}
      </div>

      {allShown && (
        <button
          onClick={() => navigate("/gifquiz")}
          style={{
            marginTop: "3rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "20px 50px",
            fontSize: "2em",
            fontWeight: "bold",
            cursor: "pointer",
            animation: "pulse 1.2s infinite",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          Next <span style={{ fontSize: "2em" }}>→</span>
        </button>
      )}

      {/* Pulse animation keyframes */}
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

const selectBtn = {
  padding: "48px 36px",
  fontSize: "2em",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  minWidth: "300px",
  textAlign: "center",
  animation: "pulse 2s infinite",
  transition: "transform 0.2s ease"
};

const textStyle = {
  fontSize: "2.2em",
  marginTop: "16px",
  color: "#333",
  maxWidth: "100%",
  wordWrap: "break-word"
};
