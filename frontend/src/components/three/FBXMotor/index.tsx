'use client'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { useLoader, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Group, Object3D } from 'three'
//import { useFBXMotorStore } from '@/store/useFBXMotorStore'
import { useMotorStore } from '@/store/motorStore'

export default function FBXMotor() {
  const rootGroup = useRef<Group>(null)
  const motorRef = useRef<Object3D | null>(null)
  const model = useLoader(FBXLoader, '/models/motor.fbx')
  //const { isRunning, rpm, angle } = useFBXMotorStore()
  const { isRunning, rpm, angle } = useMotorStore()
  const currentRotation = useRef(0)

  useEffect(() => {
    console.log('🔧 Motor state - Running:', isRunning, 'RPM:', rpm, 'Angle:', angle)
  }, [isRunning, rpm, angle])

  useEffect(() => {
    const clone = model.clone()

    clone.traverse((node: Object3D) => {
      if (node.name.toLowerCase().includes('axis')) {
        console.log('✅ 取得 motor 部件名稱:', node.name)
      }
      if (node.name === 'axis') {
        motorRef.current = node
      }
    })

    rootGroup.current?.clear()
    rootGroup.current?.add(clone)
  }, [model])

  useFrame((_, delta) => {
  if (!motorRef.current) return

  if (isRunning && rpm > 0) {
    const speed = (rpm / 60) * Math.PI * 2 * delta
    currentRotation.current += speed
    motorRef.current.rotation.z = currentRotation.current
    console.log('🔄 Rotating at', rpm, 'RPM')
  }

  if (rootGroup.current) {
    rootGroup.current.rotation.y = (angle * Math.PI) / 180
  }
})

  return (
    <group ref={rootGroup} position={[-2, 3, 0]} scale={[0.01, 0.01, 0.01]} />
  )
}