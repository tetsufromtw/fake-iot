'use client'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { useLoader, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Group, Object3D } from 'three'
import { useMotorStore } from '@/store/motorStore'

export default function FBXMotor() {
  const rootGroup = useRef<Group>(null)
  const motorRef = useRef<Object3D | null>(null)
  const model = useLoader(FBXLoader, '/models/motor.fbx')
  const {isRunning, motor1_pos, motor2_pos, temp_value} = useMotorStore()
  

  const lastPulsePos = useRef(0)
  const totalRotations = useRef(0)
  const currentRotation = useRef(0)

  useEffect(() => {
    console.log('🔧 Motor state - Running: ', isRunning, 'Motor1: ', motor1_pos, 'Motor2: ', motor2_pos, 'Temp: ', temp_value)
  }, [isRunning, motor1_pos, motor2_pos, temp_value])

  useEffect(() => {
    const clone = model.clone()

    clone.traverse((node: Object3D) => {
      if (node.name.toLowerCase().includes('axis')) {
        console.log('motor:', node.name)
      }
      if (node.name === 'axis') {
        motorRef.current = node
      }
    })

    rootGroup.current?.clear()
    rootGroup.current?.add(clone)
  }, [model])

  useFrame((_, delta) => {
    if (!motorRef.current || !isRunning || motor1_pos === undefined) return


    const pulseChange = motor1_pos - lastPulsePos.current
    

    if (pulseChange < -5000) {

      totalRotations.current += 1
    } else if (pulseChange > 5000) {

      totalRotations.current -= 1
    }
    

    const targetAngle = (totalRotations.current * 360 + (motor1_pos / 10000) * 360) * (Math.PI / 180)
    

    const currentAngle = motorRef.current.rotation.z
    const angleDiff = targetAngle - currentAngle
    const lerpSpeed = 5 
    
    motorRef.current.rotation.z += angleDiff * delta * lerpSpeed
    
    lastPulsePos.current = motor1_pos
    
    console.log('🎯 Target:', (totalRotations.current * 360 + (motor1_pos / 10000) * 360), '度, Current:', (currentAngle * 180 / Math.PI), '度')
  })

  return (
    <group ref={rootGroup} position={[-2, 3, 0]} scale={[0.01, 0.01, 0.01]} />
  )
}