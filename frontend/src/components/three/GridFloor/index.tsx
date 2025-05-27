'use client'

import { Grid } from '@react-three/drei'

export default function GridFloor() {
  return (
    <>
      {/* 地板 */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* 網格 */}
      <Grid
        args={[50, 50]}
        position={[0, -0.99, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1a1a1a"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#2a2a2a"
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid
      />
    </>
  )
}