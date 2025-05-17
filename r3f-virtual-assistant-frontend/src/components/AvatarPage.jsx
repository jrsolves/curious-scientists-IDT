// src/components/AvatarPage.jsx
import React, { Suspense, useRef, useEffect, useState } from "react";
import { useNavigate, useLocation, useMatch } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";

import Avatar   from "./Avatar";
import Avatar1  from "./Avatar1";
import Avatar2  from "./Avatar2";
import Avatar4  from "./Avatar4";
import CustomVideoPlayer from "./CustomVideoPlayer";

export default function AvatarPage() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const cameraRef  = useRef();
  const isAvatar4  = useMatch({ path: "/avatar4",  end: true });
  const isTeacher2 = useMatch({ path: "/teacher2", end: true });

  const [phoneme, setPhoneme]     = useState("rest");
  const [activeBtn, setActiveBtn] = useState(null);
  const [chatMessage, setChatMessage] = useState(
    "Welcome! Today I’m going to explain how our skeletal hand works."
  );

  useEffect(() => {
    if (cameraRef.current) cameraRef.current.lookAt(2.5, -2.5, 0);
  }, []);

  function getAvatar() {
    if (isAvatar4) {
      return <Avatar4 chatMessage={chatMessage} />;
    }
    if (isTeacher2) {
      // use the same AvatarPage <Canvas> but render Avatar2 inside it
      return <Avatar2 />;
    }
    switch (location.pathname) {
      case "/avatar1":
        return <Avatar1 onPhonemeChange={setPhoneme} />;
      case "/avatar2":
        return <Avatar2 onPhonemeChange={setPhoneme} />;
      default:
        return <Avatar onPhonemeChange={setPhoneme} />;
    }
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {!isAvatar4 && !isTeacher2 && (
        <div style={{ position: "absolute", zIndex: 0, inset: 0 }}>
          <CustomVideoPlayer videoName="cardboard_arm" />
        </div>
      )}

      <div style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 10,
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        padding: "4px 8px",
        borderRadius: 4,
        fontFamily: "monospace",
      }}>
        Phoneme: {phoneme}
      </div>

      <div style={{
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 10,
        display: "flex",
        gap: 8,
      }}>
        <button
          onClick={() => navigate(-1)}
          onMouseDown={() => setActiveBtn("back")}
          onMouseUp={() => setActiveBtn(null)}
          onMouseLeave={() => setActiveBtn(null)}
          style={{
            padding: "6px 12px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            transform: activeBtn === "back" ? "scale(0.95)" : "scale(1)",
            transition: "transform 0.1s",
          }}
        >
          Back
        </button>

        <button
          onClick={() => navigate("/avatar4")}
          onMouseDown={() => setActiveBtn("next")}
          onMouseUp={() => setActiveBtn(null)}
          onMouseLeave={() => setActiveBtn(null)}
          style={{
            padding: "6px 12px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            transform: activeBtn === "next" ? "scale(0.95)" : "scale(1)",
            transition: "transform 0.1s",
          }}
        >
          Go to Avatar4
        </button>

        <button
          onClick={() => navigate("/teacher2")}
          onMouseDown={() => setActiveBtn("teach")}
          onMouseUp={() => setActiveBtn(null)}
          onMouseLeave={() => setActiveBtn(null)}
          style={{
            padding: "6px 12px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            transform: activeBtn === "teach" ? "scale(0.95)" : "scale(1)",
            transition: "transform 0.1s",
          }}
        >
          Go to Teacher2
        </button>
      </div>

      {isAvatar4 && (
        <textarea
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          rows={3}
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            zIndex: 10,
            padding: "8px",
            fontSize: "1rem",
          }}
        />
      )}

      <Canvas
        style={{ position: "absolute", inset: 0, zIndex: 1, background: "transparent" }}
        gl={{ alpha: true }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
        shadows
      >
        <PerspectiveCamera ref={cameraRef} makeDefault fov={40} position={[-2.98, 0, 8]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7]} intensity={1} />

        <Suspense fallback={null}>
          {getAvatar()}
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
