import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import getIntentModelPath from "../utils/getIntentModelPath"; // ✅ Use a non-hook utility function

export function Avatar4({ onOutlineReady, chatMessage = "", rotation = [0, -0.8, 0.03], position = [6, -5, 0], ...props }) {
  const group = useRef();
  const [intentModelPath, setIntentModelPath] = useState("/models/Idle.glb");
  const [animation, setAnimation] = useState("Idle");
  const gltf = useGLTF(intentModelPath);
  const { scene, animations } = gltf;
  const { actions } = useAnimations(animations, group);

  const blinkTimer = useRef(0);
  const blinkInterval = useRef(Math.random() * 3 + 4);
  const isBlinking = useRef(false);
  const blinkProgress = useRef(0);
  const swayTimer = useRef(0);
  const loggedTargets = useRef(false);
  const justBlinked = useRef(false);
  const doDoubleBlink = useRef(false);

  useEffect(() => {
    const newIntentPath = getIntentModelPath(chatMessage);
    if (newIntentPath !== intentModelPath) {
      setIntentModelPath(newIntentPath);
    }
  }, [chatMessage]);

  useEffect(() => {
    if (animations.length > 0) {
      setAnimation(animations[0].name.toLowerCase());
    }
  }, [animations]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        const name = child.material.name.toLowerCase();
        const baseColor = child.material.color?.clone() || new THREE.Color(0xFFFFFF);
        const map = child.material.map || null;

        const toonMaterial = new THREE.MeshToonMaterial({
          color: baseColor.clone().multiplyScalar(.4),
          map,
          transparent: false,
          opacity: 1,
          depthWrite: true,
          alphaTest: 0.1,
          toneMapped: true,
          side: THREE.FrontSide,
        });

        if (name.includes("glass")) {
          toonMaterial.transparent = true;
          toonMaterial.opacity = 2;
          toonMaterial.color = new THREE.Color("#99ccee");
          toonMaterial.side = THREE.DoubleSide;
        } else if (name.includes("hair")) {
          toonMaterial.color = baseColor.clone().multiplyScalar(0.4);
        } else if (name.includes("brow") || name.includes("lash")) {
          toonMaterial.transparent = true;
          toonMaterial.opacity = 1;
          toonMaterial.color = new THREE.Color(0x552a0b);
        } else if (name.includes("skin")) {
          toonMaterial.color = baseColor.clone().multiplyScalar(0.4);
        }

        child.material = toonMaterial;
        child.material.needsUpdate = true;
        child.geometry?.computeVertexNormals();
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
    if (actions?.[animation]) {
      const currentAction = actions[animation];
      currentAction.reset().fadeIn(0.5).play();
      return () => {
        actions[animation]?.fadeOut(0.5);
      };
    } else {
      console.warn("⚠️ Animation not found:", animation);
    }
  }, [actions, animation]);

  useFrame((_, delta) => {
    swayTimer.current += delta;
    if (group.current) {
      const sway = Math.sin(swayTimer.current * 0.5) * 0.06;
      group.current.rotation.y = rotation[1] + sway;
    }

    blinkTimer.current += delta;
    if (!isBlinking.current && blinkTimer.current > blinkInterval.current && !justBlinked.current) {
      isBlinking.current = true;
      blinkProgress.current = 0;
      blinkTimer.current = 0;
      justBlinked.current = true;
      doDoubleBlink.current = Math.random() < 0.3;
    }

    if (isBlinking.current) {
      blinkProgress.current += delta;
    }

    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
        if (!loggedTargets.current) {
          console.log(`🧠 Morph targets for "${child.name}":`, Object.keys(child.morphTargetDictionary));
        }

        const blinkIndex = child.morphTargetDictionary["Fcl_EYE_Close"];
        const smileIndex = child.morphTargetDictionary["Fcl_MTH_Fun"];

        if (blinkIndex !== undefined) {
          const blinkValue = isBlinking.current
            ? Math.sin(Math.min(blinkProgress.current, 0.2) * Math.PI / 0.2)
            : 0;

          child.morphTargetInfluences[blinkIndex] = THREE.MathUtils.lerp(
            child.morphTargetInfluences[blinkIndex],
            blinkValue,
            0.6
          );

          if (blinkProgress.current > 0.25) {
            isBlinking.current = false;
            blinkProgress.current = 0;

            if (doDoubleBlink.current) {
              setTimeout(() => {
                isBlinking.current = true;
                blinkProgress.current = 0;
                doDoubleBlink.current = false;
              }, 100 + Math.random() * 100);
            } else {
              justBlinked.current = false;
              blinkInterval.current = Math.random() * 3 + 4;
            }
          }
        }

        if (smileIndex !== undefined) {
          child.morphTargetInfluences[smileIndex] = THREE.MathUtils.lerp(
            child.morphTargetInfluences[smileIndex],
            1,
            0.08
          );
        }
      }
    });

    loggedTargets.current = true;
  });

  return (
    <group
      {...props}
      ref={group}
      scale={[8, 8, 8]}
      position={position}
      rotation={rotation}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/Idle.glb");
export default Avatar4;
