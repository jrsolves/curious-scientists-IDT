import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'three',
      'three/examples/jsm/postprocessing/EffectComposer',
      'three/examples/jsm/postprocessing/RenderPass',
      'three/examples/jsm/postprocessing/OutlinePass'
    ]
  }
});
