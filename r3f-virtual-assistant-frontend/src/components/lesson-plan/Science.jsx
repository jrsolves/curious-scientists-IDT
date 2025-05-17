import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GiSkeletalHand,
  GiSlime,
  GiShield,
  GiCrystalCluster
} from "react-icons/gi";
import {
  FaRegLightbulb,
  FaMicroscope,
  FaLeaf,
  FaHeartbeat,
  FaStar
} from "react-icons/fa";

export default function Science() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const modules = [
    {
      title: "Skeletal Hand & Tendons",
      icon: <GiSkeletalHand />,
      desc: "Build a model skeletal hand to explore how tendons pull on bones to create movement.",
      isSpecial: true,
      route: "/introduction-video"  // ✅ updated route
    },
    {
      title: "Solar System Exploration",
      icon: <FaRegLightbulb />,
      desc: "Discover planets and stars through interactive models.",
      isSpecial: false
    },
    {
      title: "Microscope Investigations",
      icon: <FaMicroscope />,
      desc: "Examine slides and learn microscopy basics.",
      isSpecial: false
    },
    {
      title: "How Bees Save the World",
      icon: <FaLeaf />,
      desc: "Investigate the role of bees in pollination and ecosystem health.",
      isSpecial: false
    },
    {
      title: "Healthcare & Sports Medicine",
      icon: <FaHeartbeat />,
      desc: "Learn about athlete care, injury prevention, and basic anatomy.",
      isSpecial: false
    },
    {
      title: "Immunity Insights",
      icon: <GiShield />,
      desc: "Explore the immune system and how our bodies defend against pathogens.",
      isSpecial: false
    },
    {
      title: "Slime Making Fun",
      icon: <GiSlime />,
      desc: "Create and experiment with slime to learn about polymers and viscosity.",
      isSpecial: false
    },
    {
      title: "Crystal Rock Experiment",
      icon: <GiCrystalCluster />,
      desc: "Grow your own crystals and discover mineral formation processes.",
      isSpecial: false
    }
  ];

  return (
    <div style={pageContainer}>
      <h1 style={title}>Science Lesson Plan</h1>
      <p style={intro}>
        Welcome to your tailored science adventure! Explore these modules to dive into fascinating scientific concepts.
      </p>

      <div style={gridContainer}>
        {modules.map((mod, i) => (
          <button
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => mod.isSpecial && navigate(mod.route)}
            style={{
              ...moduleBtn,
              backgroundColor: mod.isSpecial
                ? hovered === i ? hoverColor : baseColorSpecial
                : hovered === i ? "#000" : baseColor,
              color: "#fff",
              transform: hovered === i ? "scale(1.05)" : "scale(1)",
              position: "relative",
              cursor: mod.isSpecial ? "pointer" : "default"
            }}
          >
            <div style={moduleIcon}>{mod.icon}</div>
            <div style={moduleTitle}>
              {mod.title}
              {!mod.isSpecial && <div style={comingSoonText}>(Coming Soon!)</div>}
            </div>
            <div style={moduleDesc}>{mod.desc}</div>
            {mod.isSpecial && (
              <div style={badgeStyle}>
                <FaStar style={{ marginRight: "4px" }} /> Anatomy Badge
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate(-1)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#000";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#007bff";
          e.currentTarget.style.color = "#fff";
        }}
        style={backBtn}
      >
        ← Back
      </button>
    </div>
  );
}

// Styles
const baseColorSpecial = "#A0522D"; // sienna brown
const baseColor = "#A0522D";
const hoverColor = "#228B22"; // forest green for hover

const pageContainer = {
  padding: "40px 20px",
  maxWidth: "1200px",
  margin: "0 auto",
  textAlign: "center",
  fontFamily: "Segoe UI, sans-serif",
  color: "#2c3e50"
};

const title = { fontSize: "3em", marginBottom: "20px" };

const intro = {
  fontSize: "1.2em",
  marginBottom: "30px",
  lineHeight: 1.5
};

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", // ✅ 1/3 wider
  gap: "20px",
  marginBottom: "40px",
  justifyContent: "center"
};

const moduleBtn = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "36px", // slightly increased
  minHeight: "270px",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease-in-out"
};

const moduleIcon = {
  fontSize: "2.5em",
  marginBottom: "10px"
};

const moduleTitle = {
  fontSize: "1.4em",
  fontWeight: "600",
  marginBottom: "6px"
};

const comingSoonText = {
  fontSize: "0.9em",
  color: "#fff",
  marginLeft: "6px"
};

const moduleDesc = {
  fontSize: "1em",
  lineHeight: 1.3,
  color: "#eee",
  textAlign: "center"
};

const badgeStyle = {
  position: "absolute",
  bottom: "10px",
  right: "10px",
  fontSize: "0.8em",
  color: "#FFD700",
  display: "flex",
  alignItems: "center"
};

const backBtn = {
  padding: "10px 20px",
  fontSize: "1em",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
