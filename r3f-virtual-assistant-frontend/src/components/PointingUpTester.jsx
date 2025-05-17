import React, { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin } from '@pixiv/three-vrm'
import * as THREE from 'three'

function PointingUpTesterScene({ url = '/models/Amanda_.vrm' }) {
  const groupRef = useRef()
  const mixerRef = useRef()
  const rightUpperArmRef = useRef()
  const rightLowerArmRef = useRef()
  const rightHandRef = useRef()
  const startTimeRef = useRef(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.register(parser => new VRMLoaderPlugin(parser))

    loader.loadAsync(url)
      .then(gltf => {
        const vrm = gltf.userData.vrm
        vrm.scene.rotation.y = Math.PI
        groupRef.current.add(vrm.scene)
        mixerRef.current = new THREE.AnimationMixer(vrm.scene)

        const humanoid = vrm.humanoid
        rightUpperArmRef.current = humanoid.getRawBoneNode('rightUpperArm')
        rightLowerArmRef.current = humanoid.getRawBoneNode('rightLowerArm')
        rightHandRef.current = humanoid.getRawBoneNode('rightHand')

        // Set initial T‑pose (arms down)
        if (rightUpperArmRef.current) rightUpperArmRef.current.rotation.set(0, 0, 0)
        if (rightLowerArmRef.current) rightLowerArmRef.current.rotation.set(0, 0, 0)
        if (rightHandRef.current) rightHandRef.current.rotation.set(0, 0, 0)

        // Record animation start time
        startTimeRef.current = performance.now()
      })
      .catch(err => console.error('Failed to load VRM:', err))
  }, [url])

  useFrame((_, delta) => {
    mixerRef.current?.update(delta)
    const now = performance.now()
    const start = startTimeRef.current
    if (!start) return
    const elapsed = now - start

    // Delay pointing for 1 second with arms down
    if (elapsed < 1000) return

    // After delay, smoothly transition to pointing pose
    const t = now / 1000

    // Upper arm: lift forward/up
    if (rightUpperArmRef.current) {
      const targetUpperX = THREE.MathUtils.degToRad(-60)
      rightUpperArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightUpperArmRef.current.rotation.x,
        targetUpperX,
        0.1
      )
      rightUpperArmRef.current.rotation.y = 0
      rightUpperArmRef.current.rotation.z = 0
    }

    // Lower arm: bend elbow
    if (rightLowerArmRef.current) {
      const targetLowerX = THREE.MathUtils.degToRad(-30)
      rightLowerArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightLowerArmRef.current.rotation.x,
        targetLowerX,
        0.1
      )
      rightLowerArmRef.current.rotation.y = 0
      rightLowerArmRef.current.rotation.z = 0
    }

    // Hand: palm up + subtle twist
    if (rightHandRef.current) {
      const targetHandX = THREE.MathUtils.degToRad(-90)
      rightHandRef.current.rotation.x = THREE.MathUtils.lerp(
        rightHandRef.current.rotation.x,
        targetHandX,
        0.1
      )
      rightHandRef.current.rotation.z = Math.sin(t * 2) * THREE.MathUtils.degToRad(5)
      rightHandRef.current.rotation.y = 0
    }
  })

  return <group ref={groupRef} position={[0, -1.5, 0]} scale={[9, 9, 9]} />
}

export default function PointingUpTester({ url }) {
  return (
    <Canvas shadows style={{ width: '100%', height: '100vh' }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={1} />
      <PointingUpTesterScene url={url} />
    </Canvas>
  )
}
