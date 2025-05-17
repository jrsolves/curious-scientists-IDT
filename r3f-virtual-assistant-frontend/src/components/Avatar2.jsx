// src/components/Avatar2.jsx
import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";

const VISEME_MAP = {
  A:    "Fcl_MTH_A",
  E:    "Fcl_MTH_E",
  I:    "Fcl_MTH_I",
  O:    "Fcl_MTH_O",
  U:    "Fcl_MTH_U",
  REST: "Fcl_MTH_Rest",
};

export default function Avatar2({
  rotation = [0, -0.8, 0.03],
  position = [6, -5, 0],
}) {
  const group = useRef();
  const { speak, lipsyncData } = useChat();
  const [ready, setReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [visemesReady, setVisemesReady] = useState(false);

  // blink / sway
  const blinkTimer = useRef(0);
  const blinkProgress = useRef(0);
  const isBlinking = useRef(false);
  const justBlinked = useRef(false);
  const doDoubleBlink = useRef(false);
  const swayTimer = useRef(0);

  // lipsync
  const lipsyncTimer = useRef(0);
  const totalTime = useRef(0);

  // load models
  const idleGltf    = useGLTF("/models/jerome.glb");
  const teacherGltf = useGLTF("/models/jerome.glb");
  const { scene: idleScene } = idleGltf;
  const { scene: teacherScene, animations } = teacherGltf;
  const { mixer, actions } = useAnimations(animations, group);

  // cache all skinned-meshes
  const skinned = useRef([]);
  useEffect(() => {
    skinned.current = [];
    idleScene.traverse((c) => {
      if (c.isSkinnedMesh && c.morphTargetDictionary) {
        skinned.current.push(c);
      }
    });
  }, [idleScene]);

  // materials + idle anim
  useEffect(() => {
    const base = [];
    teacherScene.traverse((n) => (n.isMesh||n.isSkinnedMesh) && base.push(n));
    let mi = 0;
    idleScene.traverse((n) => {
      if (n.isMesh||n.isSkinnedMesh) {
        const src = base[mi++];
        n.material = new THREE.MeshToonMaterial({
          alphaTest: 0.5,
          color:         src.material.color.clone(),
          map:           src.material.map||null,
          normalMap:     src.material.normalMap||null,
          transparent:   false,
          opacity:       src.material.opacity,
          side:          THREE.DoubleSide,
          depthWrite:    true,
          depthTest:     true,
          polygonOffset: true,
          polygonOffsetFactor:1,
          polygonOffsetUnits:1,
        });
        n.frustumCulled = false;
      }
    });
    if (animations.length && actions[animations[0].name]) {
      actions[animations[0].name].reset().fadeIn(0.5).play();
    }
    setReady(true);
  }, [idleScene, teacherScene, animations, actions]);

  useFrame((_, dt) => {
    if (!ready) return;

    // SWAY
    swayTimer.current += dt;
    group.current.rotation.y = rotation[1] + Math.sin(swayTimer.current*.5)*.02;

    // BLINK
    blinkTimer.current += dt;
    if (!isBlinking.current && blinkTimer.current > 3 + Math.random()*3 && !justBlinked.current) {
      isBlinking.current = true;
      blinkProgress.current = 0;
      blinkTimer.current = 0;
      justBlinked.current = true;
      doDoubleBlink.current = Math.random()<.3;
    }
    if (isBlinking.current) blinkProgress.current += dt;

    // only run lipsync loop if we have visemes
    if (isSpeaking && visemesReady) {
      lipsyncTimer.current += dt;

      // find cue
      const cue = lipsyncData.current.find(
        (c) => lipsyncTimer.current >= c.start && lipsyncTimer.current < c.end
      )||{value:"REST"};

      // drive every morph
      skinned.current.forEach((mesh) => {
        const dict = mesh.morphTargetDictionary;
        const infl = mesh.morphTargetInfluences;
        // zero all visemes
        Object.values(VISEME_MAP).forEach((m) => {
          if (dict[m]!=null) {
            infl[dict[m]] = THREE.MathUtils.lerp(infl[dict[m]]||0, 0, 0.1);
          }
        });
        // then set active one to 0.5
        const mName = VISEME_MAP[cue.value]||VISEME_MAP.REST;
        if (dict[mName]!=null) {
          infl[dict[mName]] = THREE.MathUtils.lerp(infl[dict[mName]]||0, 0.5, 0.2);
        }
      });
    }

    // blink morph
    skinned.current.forEach((mesh) => {
      const d = mesh.morphTargetDictionary;
      if (d["Fcl_EYE_Close"]!=null) {
        const t = Math.min(blinkProgress.current, .2)/.2;
        const v = isBlinking.current ? Math.sin(t*Math.PI) : 0;
        mesh.morphTargetInfluences[d["Fcl_EYE_Close"]] = THREE.MathUtils.lerp(
          mesh.morphTargetInfluences[d["Fcl_EYE_Close"]]||0,
          v, .6
        );
      }
    });
    if (blinkProgress.current>.25) {
      isBlinking.current=false;
      blinkProgress.current=0;
      justBlinked.current=false;
    }

    mixer.update(dt);
  });

  const handleSpeak = async () => {
    setIsSpeaking(true);
    lipsyncTimer.current=0;
    // wait for the server to send back audio+visemes
    await speak("Hello! I am Jerome, your assistant.");
    // once visemes are populated, enable the loop
    if (lipsyncData.current.length>0) {
      totalTime.current = lipsyncData.current.slice(-1)[0].end;
      setVisemesReady(true);
      // turn off speaking when done
      setTimeout(()=>setIsSpeaking(false), totalTime.current*1000);
    }
  };

  if (!ready) return null;
  return (
    <>
      <group
        ref={group}
        position={position}
        rotation={rotation}
        scale={[8,8,8]}>
        <primitive object={idleScene} />
      </group>
      <Html center style={{pointerEvents:"auto", zIndex:1}}>
        <button onClick={handleSpeak} disabled={isSpeaking}>
          {isSpeaking ? "Speaking…" : "Speak"}
        </button>
      </Html>
    </>
  );
}

useGLTF.preload("/models/jerome.glb");
useGLTF.preload("/models/jerome.glb");
