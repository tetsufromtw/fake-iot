'use client'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { useLoader, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Group, Object3D, Mesh, MeshStandardMaterial, Color } from 'three'
import { useMotorStore } from '@/store/motorStore'

function createAxisMaterial() {
  const METALLIC_COLORS = [
    '#A9A9A9', // DarkGray
    '#C0C0C0', // Silver
    '#808080', // Gray
    '#708090', // SlateGray
    '#B87333', // Copper
    '#D4AF37', // Gold
    '#BCC6CC', // Titanium
    '#6D7B8D', // Gunmetal
  ]

  const index = Math.floor(Math.random() * METALLIC_COLORS.length)
  const color = new Color(METALLIC_COLORS[index])

  return new MeshStandardMaterial({
    color,
    metalness: 1.0,
    roughness: 0.3,
    envMapIntensity: 1.2,
  })
}


export default function FBXMotor({
  position = [0, 0, 0],
  motorId = 1,
}: {
  position?: [number, number, number]
  motorId?: 1 | 2
}) {
  const rootGroup = useRef<Group>(null)
  const motorRef = useRef<Object3D | null>(null)
  const model = useLoader(FBXLoader, '/models/motor.fbx')
  const { isRunning, motor1_pos, motor2_pos } = useMotorStore()

  const lastPulsePos = useRef(0)
  const totalRotations = useRef(0)

useEffect(() => {
  if (rootGroup.current) {
    while (rootGroup.current.children.length > 0) {
      const child = rootGroup.current.children[0]
      rootGroup.current.remove(child)
    }
  }

  const clone = model.clone()
  const materialsToDispose: MeshStandardMaterial[] = []

  clone.traverse((node: Object3D) => {
    if (node.name === 'axis' && (node as Mesh).isMesh) {
      const mesh = node as Mesh
      motorRef.current = node
      const material = createAxisMaterial()
      mesh.material = material
      mesh.castShadow = true
      mesh.receiveShadow = true
      materialsToDispose.push(material)
    }
  })

  rootGroup.current?.add(clone)

  return () => {
    if (rootGroup.current) {
      while (rootGroup.current.children.length > 0) {
        const child = rootGroup.current.children[0]
        rootGroup.current.remove(child)
      }
    }

    for (const mat of materialsToDispose) {
      mat.dispose()
    }
  }
}, [model])


  useFrame((_, delta) => {
    const motorPos = motorId === 1 ? motor1_pos : motor2_pos
    if (!motorRef.current || !isRunning || motorPos === undefined) return

    const pulseChange = motorPos - lastPulsePos.current

    if (pulseChange < -5000) totalRotations.current += 1
    else if (pulseChange > 5000) totalRotations.current -= 1

    const targetAngle = (totalRotations.current * 360 + (motorPos / 10000) * 360) * (Math.PI / 180)
    const currentAngle = motorRef.current.rotation.z
    const angleDiff = targetAngle - currentAngle
    const lerpSpeed = 5

    motorRef.current.rotation.z += angleDiff * delta * lerpSpeed
    lastPulsePos.current = motorPos
  })

  return <group ref={rootGroup} position={position} scale={[0.01, 0.01, 0.01]} />
}
