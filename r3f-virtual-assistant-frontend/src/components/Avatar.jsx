// src/components/Avatar.jsx
import React, {
  useRef, useState, useLayoutEffect, useMemo, Suspense
} from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useFrame }              from "@react-three/fiber";
import * as THREE                from "three";
import { useChat }               from "../hooks/useChat";

// viseme → morph map
const VISEME_MAP = {
  A:    "Fcl_MTH_A",
  E:    "Fcl_MTH_E",
  I:    "Fcl_MTH_I",
  O:    "Fcl_MTH_O",
  U:    "Fcl_MTH_U",
  REST: "Fcl_MTH_Rest",
};

function AvatarContent({
  onOutlineReady,
  rotation = [0, -0.8, 0.03],
  position = [6, -5, 0],
  scale    = [8, 8, 8],
}) {
  const group = useRef();

  // Load Idle + Teaching models
  const idleGltf  = useGLTF("/models/Idle.glb");
  const teachGltf = useGLTF("/models/teaching.glb");
  const idleScene  = idleGltf.scene;
  const teachScene = teachGltf.scene;

  // Cache original Idle colors
  const origColors = useMemo(() => {
    const arr = [];
    idleScene.traverse(node => {
      if ((node.isMesh||node.isSkinnedMesh) && node.material?.color) {
        arr.push(node.material.color.clone());
      }
    });
    return arr;
  }, [idleScene]);

  // Animation mixers
  const idleAnim  = useAnimations(idleGltf.animations,  group);
  const teachAnim = useAnimations(teachGltf.animations, group);

  const { speak, lipsyncData } = useChat();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lipsyncTimer = useRef(0);

  // Blink refs
  const blinkTargets    = useRef([]);
  const blinkTimer      = useRef(0);
  const blinkInterval   = useRef(Math.random()*3+4);
  const isBlinking      = useRef(false);
  const blinkProg       = useRef(0);
  const doDoubleBlink   = useRef(false);
  const justBlinked     = useRef(false);

  // Viseme refs
  const mouthMeshes      = useRef([]);
  const eyeVisemeTargets = useRef([]);

  // Pick active scene + mixer
  const activeScene = isSpeaking ? teachScene : idleScene;
  const { mixer, actions } = isSpeaking ? teachAnim : idleAnim;

  // Material + morph setup on scene change
  useLayoutEffect(() => {
    let mi = 0;
    activeScene.traverse(node => {
      if ((node.isMesh||node.isSkinnedMesh) && origColors[mi]) {
        const base = origColors[mi++];
        const nm   = node.material.name.toLowerCase();
        let mul    = 0.4;
        if (nm.includes("hair")) mul = 0.3;
        if (nm.includes("skin")) mul = 0.3;

        node.material = new THREE.MeshToonMaterial({
          alphaTest:           0.2,
          color:               base.clone().multiplyScalar(mul),
          map:                 node.material.map || null,
          normalMap:           node.material.normalMap || null,
          transparent:         false,
          opacity:             node.material.opacity,
          side:                THREE.DoubleSide,
          depthWrite:          true,
          depthTest:           true,
          polygonOffset:       true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits:  1,
        });
        node.frustumCulled = false;
      }
    });

    blinkTargets.current    = [];
    mouthMeshes.current     = [];
    eyeVisemeTargets.current= [];
    activeScene.traverse(n => {
      if (!n.isMesh && !n.isSkinnedMesh) return;
      const dict = n.morphTargetDictionary||{};
      if (dict.Fcl_EYE_Close != null) {
        blinkTargets.current.push({ mesh: n, idx: dict.Fcl_EYE_Close });
        Object.values(VISEME_MAP).forEach(k => {
          const i = dict[k];
          if (i!=null) eyeVisemeTargets.current.push({ mesh: n, idx: i });
        });
      }
      if (Object.values(VISEME_MAP).some(k=>dict[k]!=null)) {
        mouthMeshes.current.push(n);
      }
    });

    if (onOutlineReady) {
      const list = [];
      activeScene.traverse(o => {
        if ((o.isMesh||o.isSkinnedMesh) && o.visible) list.push(o);
      });
      onOutlineReady(list);
    }

    const first = Object.values(actions)[0];
    if (first) {
      first.reset().fadeIn(0.5).play();
      mixer.update(0);
    }
  }, [activeScene, origColors, actions, mixer, onOutlineReady]);

  // Frame loop
  useFrame((_, dt) => {
    if (group.current) {
      group.current.rotation.y = rotation[1] + Math.sin(Date.now()*0.001)*0.05;
    }
    mixer.update(dt);

    // Blink when silent
    if (!isSpeaking) {
      blinkTimer.current += dt;
      if (!isBlinking.current
          && blinkTimer.current >= blinkInterval.current
          && !justBlinked.current
      ) {
        isBlinking.current    = true;
        blinkProg.current     = 0;
        blinkTimer.current    = 0;
        justBlinked.current   = true;
        doDoubleBlink.current = Math.random()<0.3;
      }
      if (isBlinking.current) blinkProg.current += dt;
      blinkTargets.current.forEach(({mesh,idx})=>{
        const t = Math.min(blinkProg.current,0.2)/0.2;
        mesh.morphTargetInfluences[idx] = isBlinking.current
          ? Math.sin(t*Math.PI) : 0;
      });
      if (blinkProg.current>0.25) {
        isBlinking.current=false;
        blinkProg.current=0;
        if(doDoubleBlink.current){
          setTimeout(()=>{
            isBlinking.current    = true;
            blinkProg.current     = 0;
            doDoubleBlink.current = false;
          },150);
        } else {
          justBlinked.current=false;
          blinkInterval.current=Math.random()*3+4;
        }
      }
    } else {
      blinkTargets.current.forEach(({mesh,idx})=>{
        mesh.morphTargetInfluences[idx]=0;
      });
    }

    // Idle smile
    if (!isSpeaking) {
      mouthMeshes.current.forEach(mesh=>{
        const d = mesh.morphTargetDictionary||{};
        const i = d.Fcl_MTH_Fun;
        if (i!=null) {
          mesh.morphTargetInfluences[i] = THREE.MathUtils.lerp(
            mesh.morphTargetInfluences[i]||0,1,0.05
          );
        }
      });
    }

    // Lipsync when speaking
    if (isSpeaking) {
      lipsyncTimer.current += dt;
      const cue = lipsyncData.current.find(c=>
        lipsyncTimer.current>=c.start && lipsyncTimer.current<c.end
      )||{};
      const key = VISEME_MAP[cue.value] || VISEME_MAP.REST;

      mouthMeshes.current.forEach(mesh=>{
        const d=mesh.morphTargetDictionary||{};
        Object.values(VISEME_MAP).forEach(k=>{
          const idx=d[k];
          if(idx!=null) {
            mesh.morphTargetInfluences[idx] = THREE.MathUtils.lerp(
              mesh.morphTargetInfluences[idx]||0,0,0.1
            );
          }
        });
        const idx=d[key];
        if(idx!=null) {
          mesh.morphTargetInfluences[idx] = THREE.MathUtils.lerp(
            mesh.morphTargetInfluences[idx]||0,1,0.08
          );
        }
      });

      eyeVisemeTargets.current.forEach(({mesh,idx})=>{
        mesh.morphTargetInfluences[idx] = THREE.MathUtils.lerp(
          mesh.morphTargetInfluences[idx]||0,0,0.1
        );
      });
    }
  });

  // Speak handler with 2s shorter fallback
  const handleSpeak = async () => {
    setIsSpeaking(true);
    lipsyncTimer.current = 0;

    const mediaEl = await speak("Hi everyone! Today, we’re going to build something really cool. A robotic hand made out of cardboard! And guess what? You don’t even need a glue gun. Masking tape works perfectly. Let’s get started. First, gather everything you’ll need: cardboard, a pencil, some string or yarn, drinking straws, scissors, and masking tape. You can also grab paints or markers if you want to decorate later. Now, trace your hand onto the cardboard. I traced my left hand so I could wear the robot hand on my right. Then, carefully cut it out. If your cardboard is thick, that’s even better. It makes the hand stronger. Add gentle bends where your knuckles are. This helps the robot hand move just like a real one. Next, cut small pieces of straw and tape them along the fingers and thumb. These will guide the strings later. You can also add a simple cardboard loop or strap at the base for your hand to slide into. Secure it with masking tape. Now, thread your string or yarn through the straw pieces. Leave enough length so you can make loops for your fingers. Measure and tape little loops at the ends of the strings. You’ll use these to pull the fingers closed.  Use plenty of masking tape so everything stays in place. Time for the fun part: decorating! You can make it an Iron Man hand! Tape red construction paper and create the repulsor circles by cutting it with yellow paper. What other ways can you decorate your hand, its up to you imagination!And you’re done! Slide your hand into the strap, pull the strings, and watch the fingers move. You can even pick up light objects with it. It’s simple, fun, and a great way to learn about how real robotic and human hands work! I hope you had fun making your own robotic hand. See you next time for more awesome creations!");


    if (mediaEl && typeof mediaEl.addEventListener === "function") {
      mediaEl.addEventListener("ended", () => {
        setIsSpeaking(false);
      });
    } else {
      const last = lipsyncData.current.slice(-1)[0];
      // subtract 2000ms from fallback
      const ms = Math.max(0, (last?.end || 0) * 1000 - 2000);
      setTimeout(() => setIsSpeaking(false), ms);
    } 
  };

  return (
    <>
      <group ref={group} position={position} rotation={rotation} scale={scale}>
        <primitive object={activeScene} />
      </group>
      <Html center style={{pointerEvents:"auto",zIndex:1}}>
        <button onClick={handleSpeak} disabled={isSpeaking}
                style={{padding:"8px 16px",fontSize:"1rem"}}>
          {isSpeaking ? "Speaking…" : "Speak"}
        </button>
      </Html>
    </>
  );
}

export default function Avatar(props) {
  return (
    <Suspense fallback={<Html center style={{color:"#fff"}}>Loading avatar…</Html>}>
      <AvatarContent {...props}/>
    </Suspense>
  );
}

useGLTF.preload("/models/Idle.glb");
useGLTF.preload("/models/teaching.glb");
