import React, { Suspense, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import Avatar from "./Avatar";
import UI from "./UI";
import CustomVideoPlayer from "./CustomVideoPlayer";

export default function Introduction() {
  const navigate = useNavigate();
  const cameraRef = useRef();
  const [phoneme, setPhoneme] = useState("rest");
  const [activeBtn, setActiveBtn] = useState(null);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(2.5, -2.5, 0);
    }
  }, []);

  const navBtnStyle = (id) => ({
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9em",
    transform: activeBtn === id ? "scale(0.95)" : "scale(1)",
    transition: "transform 0.1s ease-in-out",
    pointerEvents: "auto"
  });

  return (
    <div
      className="avatar-corner"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "Segoe UI, sans-serif"
      }}
    >
      {/* 🎥 Video Background Layer */}
      <CustomVideoPlayer />

      {/* 🧠 Phoneme Debug Display */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "rgba(0, 0, 0, 0.65)",
          color: "#fff",
          padding: "5px 10px",
          borderRadius: "6px",
          fontFamily: "monospace",
          fontSize: "14px",
          zIndex: 10
        }}
      >
        Phoneme: {phoneme}
      </div>

      {/* 🧭 Navigation Buttons */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
          display: "flex",
          gap: "10px",
          pointerEvents: "auto"
        }}
      >
        <button
          onClick={() => navigate(-1)}
          onMouseDown={() => setActiveBtn("back")}
          onMouseUp={() => setActiveBtn(null)}
          onMouseLeave={() => setActiveBtn(null)}
          style={navBtnStyle("back")}
        >
          Back
        </button>
        <button
          onClick={() => navigate("/avatar")}
          onMouseDown={() => setActiveBtn("next")}
          onMouseUp={() => setActiveBtn(null)}
          onMouseLeave={() => setActiveBtn(null)}
          style={navBtnStyle("next")}
        >
          Next
        </button>
      </div>

      {/* 🧩 Floating React UI Panel */}
      <div style={{ position: "absolute", zIndex: 10, width: "100%" }}>
        <UI />
      </div>

      {/* 🎭 3D Avatar Canvas */}
      <Canvas
        className="avatar-canvas"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none"
        }}
      >
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          fov={40}
          position={[-2.98, 0, 8]}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7]} intensity={1} />

        <Suspense fallback={null}>
          <Avatar onPhonemeChange={setPhoneme} />
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
