import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";

const corresponding = {
  A: "viseme_PP", B: "viseme_kk", C: "viseme_I", D: "viseme_AA",
  E: "viseme_O", F: "viseme_U", G: "viseme_FF", H: "viseme_TH", X: "viseme_PP",
};

let setupMode = false;

export function Avatar({
  onOutlineReady,
  rotation = [0, -0.8, 0.03],
  position = [0, 0, 0],
  ...props
}) {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/teacher.glb");
  const { message, onMessagePlayed } = useChat();
  const { actions } = useAnimations(animations, group);
  const [animation, setAnimation] = useState("Idle");
  const [lipsync, setLipsync] = useState();
  const [audio, setAudio] = useState();

  const leftArm = useRef(null);
  const rightArm = useRef(null);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        const name = child.material.name.toLowerCase();
        const baseColor = child.material.color?.clone() || new THREE.Color(0x000000);
        const map = child.material.map || null;

        const toonMaterial = new THREE.MeshToonMaterial({
          color: baseColor,
          map,
          transparent: false,
          opacity: 1,
          depthWrite: true,
          alphaTest: 0.01,
          toneMapped: true,
          side: THREE.FrontSide,
        });

        if (name.includes("glass")) {
          toonMaterial.transparent = true;
          toonMaterial.opacity = 3;
          toonMaterial.color = new THREE.Color("#e6f7ff");
          toonMaterial.side = THREE.DoubleSide;
        } else if (name.includes("hair")) {
          toonMaterial.color = baseColor.clone().offsetHSL(5, 3, 3);
          toonMaterial.map = map;
        } else if (name.includes("brow") || name.includes("lash")) {
          toonMaterial.opacity = 1;
          toonMaterial.transparent = true;
          toonMaterial.color = new THREE.Color(0xd39a6a);
        } else if (name.includes("skin")) {
          toonMaterial.color = baseColor.clone().offsetHSL(3, 3, 1);
        } else {
          toonMaterial.color.offsetHSL(0, 4, 5);
        }

        child.material = toonMaterial;
        child.material.needsUpdate = true;
        child.geometry?.computeVertexNormals();
      }

      // Detect VRoid-style bone names
      if (child.isBone) {
        if (child.name === "J_Bip_L_UpperArm") leftArm.current = child;
        if (child.name === "J_Bip_R_UpperArm") rightArm.current = child;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (onOutlineReady) {
      const meshes = [];
      scene.traverse((obj) => {
        if ((obj.isMesh || obj.isSkinnedMesh) && obj.visible) {
          meshes.push(obj);
        }
      });
      onOutlineReady(meshes);
    }
  }, [scene, onOutlineReady]);

  useEffect(() => {
    if (!message) return setAnimation("Idle");
    setAnimation(message.animation === "Idle" ? "talking" : message.animation);
    setLipsync(message.lipsync);

    let audioUrl = message.audio;
    if (audioUrl && !audioUrl.startsWith("data:")) {
      audioUrl = "data:audio/mp3;base64," + audioUrl;
    }

    try {
      const audioInstance = new Audio(audioUrl);
      audioInstance.onended = onMessagePlayed;
      audioInstance.onerror = (e) => console.warn("❌ Audio error", e);
      audioInstance.play().catch((err) =>
        console.warn("⚠️ Autoplay blocked:", err.message)
      );
      setAudio(audioInstance);
    } catch (err) {
      console.error("🔇 Audio creation failed", err);
      onMessagePlayed();
    }
  }, [message]);

  useEffect(() => {
    if (actions && actions[animation]) {
      const currentAction = actions[animation];
      currentAction.reset().fadeIn(0.5).play();
      return () => {
        actions[animation]?.fadeOut(0.5);
      };
    }
  }, [animation, actions]);

  // Force arms down AND lipsync
  useFrame(() => {
    if (leftArm.current) leftArm.current.rotation.z = Math.PI / 4;
    if (rightArm.current) rightArm.current.rotation.z = -Math.PI / 4;

    if (!setupMode && message && lipsync && audio) {
      const time = audio.currentTime;
      const cue = lipsync.mouthCues.find((c) => time >= c.start && time <= c.end);
      const active = cue ? corresponding[cue.value] : null;

      scene.traverse((child) => {
        if (child.isSkinnedMesh && child.morphTargetDictionary) {
          Object.values(corresponding).forEach((viseme) => {
            const index = child.morphTargetDictionary[viseme];
            if (index !== undefined) {
              child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                child.morphTargetInfluences[index],
                viseme === active ? 1 : 0,
                0.2
              );
            }
          });
        }
      });
    }
  });

  return (
    <group
      {...props}
      ref={group}
      scale={[10, 10, 10]}
      position={[6, -5, 0]}
      rotation={rotation}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/anim.glb");
export default Avatar;
