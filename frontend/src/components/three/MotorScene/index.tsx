'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import GLTFMotor from '../Motor'
import FBXMotor from '../FBXMotor'
import Lighting from '../Lighting'
import GridFloor from '../GridFloor'

export default function MotorScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      className="w-full h-full"
      gl={{ antialias: true, alpha: true }}
    >
      <PerspectiveCamera
        makeDefault
        position={[5, 3, 5]}
        fov={45}
        near={0.1}
        far={1000}
      />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={0.5}
        rotateSpeed={0.5}
        minDistance={3}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />

      <Suspense fallback={null}>
        <Lighting />
          <ambientLight intensity={0.6} />
  <directionalLight position={[-5, 5, -5]} intensity={1} />
        {/* <GLTFMotor /> */}
<FBXMotor position={[-2, 3, 0]} motorId={1} />
<FBXMotor position={[2, 3, 0]} motorId={2} />

        <GridFloor />
        <Environment preset="city" />
      </Suspense>

      <fog attach="fog" args={['#0a0a0a', 10, 30]} />
    </Canvas>
  )
}
