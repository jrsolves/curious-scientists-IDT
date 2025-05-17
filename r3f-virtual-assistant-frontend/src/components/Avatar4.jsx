// src/components/Avatar1.jsx
import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";

// 1) re‑declare your viseme → morph map at the top:
const visemeToMorph = {
  A:    "Fcl_MTH_A",
  E:    "Fcl_MTH_E",
  I:    "Fcl_MTH_I",
  O:    "Fcl_MTH_O",
  U:    "Fcl_MTH_U",
  REST: "Fcl_MTH_Rest",
};

export default function Avatar4() {
  const group = useRef();
  const { camera } = useThree();
  const { speak, lipsyncData } = useChat();
  const [ready, setReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // your original transforms
  const defaultPosition = [-5, -380, -350];
  const defaultRotation = [-0.1, THREE.MathUtils.degToRad(10), -0.11];
  const defaultScale    = [320, 320, 320];

  // timer refs
  const lipsyncTimer = useRef(0);
  const totalTimeRef = useRef(0);

  const blinkTimer    = useRef(0);
  const blinkInterval = useRef(THREE.MathUtils.randFloat(3, 6));
  const blinkProgress = useRef(0);
  const isBlinking    = useRef(false);
  const justBlinked   = useRef(false);
  const doDoubleBlink = useRef(false);

  // load + animate
  const gltf = useGLTF("/models/teacher.glb");
  const sceneModel = gltf.scene;
  const { animations } = gltf;
  const { mixer, actions } = useAnimations(animations, group);

  useEffect(() => {
    // apply your toon materials exactly as before
    sceneModel.traverse((n) => {
      if (n.isMesh || n.isSkinnedMesh) {
        if (n.material) {
          const name = n.material.name.toLowerCase();
          if (name.includes("glass")) {
            n.material.transparent = true;
            n.material.opacity = 0.15;
            n.material.color = new THREE.Color("#cde6f5");
            n.material.side = THREE.DoubleSide;
            n.material.depthWrite = false;
          } else {
            n.material = new THREE.MeshToonMaterial({
              color:          n.material.color.clone().multiplyScalar(0.4),
              map:            n.material.map || null,
              transparent:    false,
              side:           THREE.DoubleSide,
              polygonOffset:  true,
              polygonOffsetFactor: 1,
              polygonOffsetUnits:  1,
              alphaTest:      0.5,
              depthWrite:     true,
            });
          }
        }
        n.frustumCulled = false;
      }
    });

    // play your idle animation
    if (animations.length && actions[animations[0].name]) {
      actions[animations[0].name].reset().fadeIn(0.5).play();
    }

    group.current = sceneModel;
    setReady(true);
  }, [sceneModel, animations, actions]);

  // camera
  useEffect(() => {
    camera.position.set(6, 1, 12);
    camera.lookAt(new THREE.Vector3(...defaultPosition));
  }, [camera]);

  useFrame((_, delta) => {
    if (!ready || !group.current) return;

    // sway
    group.current.rotation.y =
      defaultRotation[1] + Math.sin(Date.now() * 0.0015) * 0.02;

    // blink
    blinkTimer.current += delta;
    if (
      !isBlinking.current &&
      blinkTimer.current >= blinkInterval.current &&
      !justBlinked.current
    ) {
      isBlinking.current = true;
      blinkProgress.current = 0;
      blinkTimer.current = 0;
      justBlinked.current = true;
      doDoubleBlink.current = Math.random() < 0.3;
    }
    if (isBlinking.current) blinkProgress.current += delta;

    // lipsync: only once real cues are loaded
    if (isSpeaking && lipsyncData.current.length > 0) {
      lipsyncTimer.current += delta;
    }

    sceneModel.traverse((child) => {
      if (!child.isSkinnedMesh || !child.morphTargetDictionary) return;
      const dict = child.morphTargetDictionary;
      const infl = child.morphTargetInfluences;

      // BLINK morph
      if (dict["Fcl_EYE_Close"] != null) {
        const t = Math.min(blinkProgress.current, 0.2) / 0.2;
        const v = isBlinking.current ? Math.sin(t * Math.PI) : 0;
        infl[dict["Fcl_EYE_Close"]] = THREE.MathUtils.lerp(
          infl[dict["Fcl_EYE_Close"]] || 0,
          v,
          0.6
        );
        if (blinkProgress.current > 0.25) {
          isBlinking.current = false;
          blinkProgress.current = 0;
          justBlinked.current = false;
          blinkInterval.current = THREE.MathUtils.randFloat(3, 6);
        }
      }

      // ZERO out all visemes
      Object.values(visemeToMorph).forEach((m) => {
        const idx = dict[m];
        if (idx != null) {
          infl[idx] = THREE.MathUtils.lerp(infl[idx], 0, 0.1);
        }
      });

      // APPLY current viseme
      if (isSpeaking && lipsyncData.current.length > 0) {
        const cue =
          lipsyncData.current.find(
            (c) =>
              lipsyncTimer.current >= c.start &&
              lipsyncTimer.current < c.end
          ) || { value: "REST" };
        const mName = visemeToMorph[cue.value] || visemeToMorph.REST;
        const idx = dict[mName];
        if (idx != null) {
          infl[idx] = THREE.MathUtils.lerp(infl[idx], 0.4, 0.2);
        }
      }
    });

    mixer.update(delta);
  });

  const handleSpeak = async () => {
    setIsSpeaking(true);
    lipsyncTimer.current = 0;

    // fire off your server TTS → lipsync fetch
    await speak("Hello! I am your AI teaching assistant.");

    // once real visemes arrive, record total length & auto‑stop
    if (lipsyncData.current.length > 0) {
      totalTimeRef.current =
        lipsyncData.current[lipsyncData.current.length - 1].end;
      setTimeout(() => setIsSpeaking(false), totalTimeRef.current * 1000);
    } else {
      // no cues? just turn off after a second
      setTimeout(() => setIsSpeaking(false), 1000);
    }
  };

  if (!ready) return null;

  return (
    <>
      <primitive
        ref={group}
        object={sceneModel}
        position={defaultPosition}
        rotation={defaultRotation}
        scale={defaultScale}
      />
      <Html center style={{ pointerEvents: "auto", zIndex: 1 }}>
        <button
          onClick={handleSpeak}
          disabled={isSpeaking}
          style={{ padding: "8px 16px", fontSize: "1rem" }}
        >
          {isSpeaking ? "Speaking…" : "Speak"}
        </button>
      </Html>
    </>
  );
}

useGLTF.preload("/models/teacher.glb");
