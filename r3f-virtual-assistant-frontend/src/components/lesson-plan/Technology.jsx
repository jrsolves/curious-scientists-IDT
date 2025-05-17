// src/components/Technology.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHtml5, FaJs, FaGamepad, FaMicrochip, FaMobileAlt, FaStar } from "react-icons/fa";
import { GiSkeletalHand } from "react-icons/gi";

export default function Technology() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const modules = [
    {
      title: "Robotic Hand",
      desc: "Explore biomechanics by building a simple robotic hand.",
      icon: <GiSkeletalHand />,
      route: "/avatar1",
      isSpecial: true
    },
    { title: "Intro to HTML & CSS",      desc: "Build and style your first web page.",                        icon: <FaHtml5 /> },
    { title: "JavaScript Basics",        desc: "Learn programming fundamentals with hands-on examples.",       icon: <FaJs /> },
    { title: "Game Development",         desc: "Create a simple browser game using Canvas API.",              icon: <FaGamepad /> },
    { title: "IoT Prototype",            desc: "Connect a microcontroller to sensors and display data.",       icon: <FaMicrochip /> },
    { title: "Mobile App Development",   desc: "Design and build a cross-platform mobile app.",               icon: <FaMobileAlt /> }
  ];

  return (
    <div style={pageContainer}>
      <h1 style={title}>Technology Lesson Plan</h1>
      <p style={intro}>
        Welcome to your customized technology journey! Based on your interests,
        this plan will guide you through interactive tech projects.
      </p>

      <div style={gridContainer}>
        {modules.map((mod, i) => {
          const isSpecial = !!mod.isSpecial;
          const isHovered = hovered === i;
          return (
            <button
              key={i}
              onClick={() => isSpecial && navigate(mod.route)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...moduleBtn,
                position: 'relative',
                ...(isSpecial && isHovered ? specialHover : {}),
                cursor: isSpecial ? "pointer" : "default",
              }}
            >
              <div style={moduleIcon}>{mod.icon}</div>
              <div style={moduleTitle}>{mod.title}</div>

              {/* Surprise text for Robotic Hand */}
              

              {/* Robotics Badge in corner */}
              {isSpecial && (
                <div style={badgeStyle}>
                  <FaStar style={{ marginRight: '6px' }} /> Robotics Badge
                </div>
              )}

              {/* Coming Soon for other modules */}
              {!isSpecial && (
                <div
                  style={{
                    ...comingSoon,
                    ...(isHovered ? comingSoonHover : {}),
                  }}
                >
                  (Coming Soon!)
                </div>
              )}

              <div style={moduleDesc}>{mod.desc}</div>
            </button>
          );
        })}
      </div>

      <button onClick={() => navigate(-1)} style={backBtn}>
        ← Back
      </button>
    </div>
  );
}

// Styles
const pageContainer = {
  padding: "40px 20px",
  maxWidth: "1000px",
  margin: "0 auto",
  textAlign: "center",
  fontFamily: "Segoe UI, sans-serif",
  color: "#2c3e50",
};
const title = { fontSize: "3em", marginBottom: "20px" };
const intro = { fontSize: "1.2em", marginBottom: "30px", lineHeight: 1.5 };
const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "20px",
  marginBottom: "40px",
};
const moduleBtn = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  backgroundColor: "#50e3c2",
  color: "black",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  transition: "transform 0.1s ease-in-out, background-color 0.2s",
};
const specialHover = {
  backgroundColor: "black",
  color: "white",
  transform: "scale(1.1)",
};
const surpriseText = {
  marginTop: "10px",
  fontSize: "0.8em",  // further lowered rollover font size
  color: "white",
};
const badgeStyle = {
  position: 'absolute',
  bottom: '15px',
  right: '10px',
  fontSize: '0.8em',
  color: '#000000',
  display: 'flex',
  alignItems: 'center'
};
const comingSoon = {
  fontSize: "0.9em",
  color: "#555",
  marginBottom: "6px",
  transition: "all 0.1s ease-in-out",
};
const comingSoonHover = {
  color: "white",
  backgroundColor: "black",
};
// Icon, title, desc styles
const moduleIcon = { fontSize: "2.5em", marginBottom: "10px" };
const moduleTitle = { fontSize: "1.4em", fontWeight: "600", marginBottom: "6px" };
const moduleDesc = { fontSize: "1em", lineHeight: 1.3 };
const backBtn = {
  padding: "10px 20px",
  fontSize: "1em",
  backgroundColor: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
