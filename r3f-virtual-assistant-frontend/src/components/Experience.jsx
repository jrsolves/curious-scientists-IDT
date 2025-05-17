// src/components/Experience.jsx
import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree, extend, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import * as THREE from "three";
import Avatar4 from "./Avatar4.jsx";

extend({ EffectComposer, RenderPass, OutlinePass });

export default function Experience() {
  return (
    <div style={{ position: "absolute", width: "100vw", height: "100vh", zIndex: 0 }}>
      <Canvas shadows camera={{ position: [0, 1.4, 2.5], fov: 35 }}>
        <Suspense fallback={null}>
          <SceneContents />
        </Suspense>
      </Canvas>
    </div>
  );
}

function SceneContents() {
  const { scene, gl, camera, size } = useThree();
  const composer = useRef();
  const selected = useRef([]);

  useEffect(() => {
    scene.background = null; // Transparent background
  }, [scene]);

  useEffect(() => {
    if (!composer.current) return;
    composer.current.setSize(size.width, size.height);
  }, [size]);

  useFrame(() => {
    if (composer.current) composer.current.render();
  }, 1);

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[2, 4, 5]} intensity={1.1} castShadow />

      <Avatar4
        position={[0, -5, 0]}
        rotation={[0, -0.6, 0]}
        onOutlineReady={(meshes) => (selected.current = meshes)}
      />

      <Environment preset="sunset" />
      <OrbitControls enableZoom={false} />

      {/* 🟢 Outline composer */}
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attach="passes-0" scene={scene} camera={camera} />
        <outlinePass
          attach="passes-1"
          args={[new THREE.Vector2(size.width, size.height), scene, camera]}
          selectedObjects={selected.current}
          edgeStrength={3}
          edgeGlow={0}
          edgeThickness={1}
          visibleEdgeColor={new THREE.Color(0xffffff)}
          hiddenEdgeColor={new THREE.Color(0x000000)}
        />
      </effectComposer>
    </>
  );
}
