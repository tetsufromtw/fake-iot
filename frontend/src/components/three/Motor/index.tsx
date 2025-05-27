'use client'

import { useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useEffect, useRef } from 'react'
import { Group, MeshStandardMaterial, Mesh, Object3D } from 'three'
import { useMotorStore } from '@/store/motorStore'

export default function Motor() {
  const groupRef = useRef<Group>(null)
  const ventRef = useRef<Object3D | null>(null)
  const gltf = useLoader(GLTFLoader, '/models/scene.gltf')
  const { angle, rpm, isRunning } = useMotorStore()

  useEffect(() => {
    const model = gltf.scene.clone()

    model.traverse((child) => {
      if (child.name === 'vent') {
        ventRef.current = child
      }

      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true

        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]

        materials.forEach((mat) => {
          if (mat instanceof MeshStandardMaterial) {
            mat.metalness = 0.2
            mat.roughness = 0.5
            mat.color.set('orange')
          }
        })
      }
    })

    groupRef.current?.clear()
    groupRef.current?.add(model)
  }, [gltf])

  useFrame((_, delta) => {
    if (!ventRef.current) return

    if (isRunning) {
      const speed = (rpm / 60) * Math.PI * 2 * delta
      ventRef.current.rotation.z += speed
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y = (angle * Math.PI) / 180
    }
  })

  return <group ref={groupRef} position={[5, 0, 0]} scale={[10, 10, 10]} />
}