import React, { useRef, useEffect, Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Avatar4: Minimal rotating cube + GLTF model example to verify updates.
 */
export default function Avatar4({ position = [0, 0, 0], rotation = [0, 0, 0], ...props }) {
  const group = useRef();
  const { scene } = useGLTF("/models/teaching.glb");

  // Apply a basic material if none
  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.material = new THREE.MeshBasicMaterial({
          color: 0x888888,
          map: o.material.map || null,
        });
      }
    });
  }, [scene]);

  // Rotate the group and move up/down for visible motion
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.set(
        rotation[0] + state.clock.elapsedTime * 0.3,
        rotation[1] + state.clock.elapsedTime * 0.5,
        rotation[2]
      );
      group.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <Suspense fallback={null}>
      <group ref={group} position={position} {...props}>
        {/* GLTF model */}
        <primitive object={scene} />
        {/* Rotating test cube */}
        <mesh position={[0, 1, 0]}>  
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial color="hotpink" />
        </mesh>
      </group>
    </Suspense>
  );
}

useGLTF.preload("/models/teaching.glb");