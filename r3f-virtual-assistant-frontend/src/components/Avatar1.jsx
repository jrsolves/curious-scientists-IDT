// src/components/Avatar1.jsx
import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";

// viseme → morph map
const VISEME_MAP = {
  A:   "Fcl_MTH_A",
  E:   "Fcl_MTH_E",
  I:   "Fcl_MTH_I",
  O:   "Fcl_MTH_O",
  U:   "Fcl_MTH_U",
  REST:"Fcl_MTH_Rest",
};

export default function Avatar1({
  rotation = [0.0, 12.6, -0.05],
  position = [7, -11, -1],
  scale    = [10, 10, 10],
}) {
  const group = useRef();
  const { camera } = useThree();
  const { speak, lipsyncData } = useChat();

  const [ready, setReady]           = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // timing refs
  const lipsyncTimer  = useRef(0);
  const totalTimeRef  = useRef(0);

  const blinkTimer    = useRef(0);
  const blinkInterval = useRef(THREE.MathUtils.randFloat(3, 6));
  const blinkProg     = useRef(0);
  const isBlinking    = useRef(false);
  const justBlinked   = useRef(false);
  const doDoubleBlink = useRef(false);

  // load model + animations
  const gltf       = useGLTF("/models/teacher.glb");
  const sceneModel = gltf.scene;
  const { animations } = gltf;
  const { mixer, actions } = useAnimations(animations, group);

  // gather blink & mouth meshes on load
  const blinkTargets = useRef([]);
  const mouthMeshes  = useRef([]);

  useEffect(() => {
    // collect morph targets
    sceneModel.traverse(c => {
      if (c.isSkinnedMesh && c.morphTargetDictionary) {
        const dict = c.morphTargetDictionary;
        if (dict.Fcl_EYE_Close != null) {
          blinkTargets.current.push({ mesh: c, idx: dict.Fcl_EYE_Close });
        }
        const hasViseme = Object.values(VISEME_MAP).some(k => dict[k] != null);
        if (hasViseme) mouthMeshes.current.push(c);
      }
    });

    // apply toon material with darker base color and darker lips
    const base = [];
    sceneModel.traverse(n => (n.isMesh || n.isSkinnedMesh) && base.push(n.clone()));
    let mi = 0;
    sceneModel.traverse(n => {
      if (n.isMesh || n.isSkinnedMesh) {
        const src = base[mi++];
        // detect lip meshes by name; adjust regex if your lip meshes differ
        const isLip = /tounge/i.test(n.name);
        n.material = new THREE.MeshToonMaterial({
          alphaTest:           0.5,
          // lips darker (50%), everything else 80%
          color:               src.material.color.clone().multiplyScalar(isLip ? .1 : 0.6),
          map:                 src.material.map || null,
          side:                THREE.DoubleSide,
          depthWrite:          true,
          polygonOffset:       true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits:  1,
        });
        n.frustumCulled = false;
      }
    });

    // idle animation
    if (animations.length && actions[animations[0].name]) {
      actions[animations[0].name].reset().fadeIn(0.5).play();
    }

    group.current = sceneModel;
    setReady(true);
  }, [sceneModel, animations, actions]);

  // camera setup
  useEffect(() => {
    camera.position.set(8, -2, 14);
    camera.lookAt(
      position[0],
      position[1] + scale[1] * 0.5,
      position[2]
    );
  }, [camera, position, scale]);

  useFrame((_, dt) => {
    if (!ready) return;

    // sway
    group.current.rotation.y = rotation[1] + Math.sin(Date.now() * 0.0015) * 0.03;

    // blink logic
    blinkTimer.current += dt;
    if (!isBlinking.current && blinkTimer.current >= blinkInterval.current && !justBlinked.current) {
      isBlinking.current   = true;
      blinkProg.current    = 0;
      blinkTimer.current   = 0;
      justBlinked.current  = true;
      doDoubleBlink.current = Math.random() < 0.3;
    }
    if (isBlinking.current) blinkProg.current += dt;
    blinkTargets.current.forEach(({ mesh, idx }) => {
      const t = Math.min(blinkProg.current, 0.2) / 0.2;
      const v = isBlinking.current ? Math.sin(t * Math.PI) : 0;
      mesh.morphTargetInfluences[idx] = THREE.MathUtils.lerp(
        mesh.morphTargetInfluences[idx] || 0,
        v,
        0.6
      );
    });
    if (blinkProg.current > 0.25) {
      isBlinking.current  = false;
      blinkProg.current   = 0;
      justBlinked.current = false;
      blinkInterval.current = THREE.MathUtils.randFloat(3, 6);
      if (doDoubleBlink.current) {
        setTimeout(() => {
          isBlinking.current   = true;
          blinkProg.current    = 0;
          doDoubleBlink.current = false;
        }, 150);
      }
    }

    // update mixer
    mixer.update(dt);

    // lipsync timer
    if (isSpeaking) lipsyncTimer.current += dt;

    // smoother fade‑out for all visemes
    mouthMeshes.current.forEach(mesh => {
      const dict = mesh.morphTargetDictionary;
      Object.values(VISEME_MAP).forEach(k => {
        const idx = dict[k];
        if (idx != null) {
          mesh.morphTargetInfluences[idx] = THREE.MathUtils.lerp(
            mesh.morphTargetInfluences[idx] || 0,
            0,
            0.1
          );
        }
      });
    });

    // smoother fade‑in for active viseme
    if (isSpeaking) {
      const cue = lipsyncData.current.find(c =>
        lipsyncTimer.current >= c.start && lipsyncTimer.current < c.end
      ) || {};
      const key = VISEME_MAP[cue.value] || VISEME_MAP.REST;
      mouthMeshes.current.forEach(mesh => {
        const dict = mesh.morphTargetDictionary;
        const idx  = dict[key];
        if (idx != null) {
          mesh.morphTargetInfluences[idx] = THREE.MathUtils.lerp(
            mesh.morphTargetInfluences[idx] || 0,
            0.5,
            0.08
          );
        }
      });
    }
  });

  const handleSpeak = async () => {
    setIsSpeaking(true);
    lipsyncTimer.current = 0;
    await speak("Hello! I am your AI teaching assistant.");
    totalTimeRef.current = lipsyncData.current.length
      ? lipsyncData.current[lipsyncData.current.length - 1].end
      : 0;
    setTimeout(() => setIsSpeaking(false), totalTimeRef.current * 1000);
  };

  if (!ready) return null;

  return (
    <>
      <group ref={group} position={position} rotation={rotation} scale={scale}>
        <primitive object={sceneModel} />
      </group>
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
