// src/components/Teacher2Page.jsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import Avatar1 from "./Avatar1";

export default function Teacher2Page() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas
        style={{ background: "transparent" }}
        gl={{ alpha: true }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
      >
        <PerspectiveCamera makeDefault fov={40} position={[6, 1, 12]} />
        {/* lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 7]} intensity={1} />
        <Suspense fallback={null}>
          <Avatar1 />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
      </Canvas>
    </div>
  );
}
