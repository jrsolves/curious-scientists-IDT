import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationMixer }    from "three";
import { VRMUtils }          from "@pixiv/three-vrm";
import * as THREE            from "three";

// after vrm load and mixer creation...

const clipFiles = [
  "talk_and_gesture.glb",
  "wave.glb",
  "point.glb"
];

clipFiles.forEach((file) => {
  new GLTFLoader().load(`/animations/${file}`, (animGltf) => {
    const sourceClip = animGltf.animations[0];
    const vrmClip    = VRMUtils.retargetAnimationClip(sourceClip, vrm);
    const action     = mixer.clipAction(vrmClip);
    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.play();
  });
});
