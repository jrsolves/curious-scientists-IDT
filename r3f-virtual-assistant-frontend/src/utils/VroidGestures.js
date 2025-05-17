// src/utils/VroidGestures.js
export class VroidGestures {
    constructor(vrm) {
      this.vrm = vrm;
      // Safely grab blendShapeGroups if they exist, otherwise use empty array
      const groups =
        vrm?.blendShapeProxy?.blendShapeAvatar?.blendShapeGroups || [];
      this.blendNames = groups.map((g) => g.presetName);
    }
  
    /**
     * Fade out every preset, then fade in the one you want.
     * @param {string} name - The presetName (e.g. "Fcl_ALL_Joy")
     * @param {number} [weight=1] - Target weight (0–1)
     * @param {number} [fade=0.3] - Seconds to cross-fade
     */
    apply(name, weight = 1, fade = 0.3) {
      const proxy = this.vrm.blendShapeProxy;
      // guard if proxy is missing
      if (!proxy) return;
      // fade all out
      this.blendNames.forEach((b) => proxy.setValue(b, 0, fade));
      // fade in target
      proxy.setValue(name, weight, fade);
    }
  }
  