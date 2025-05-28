import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useMotorStore } from '@/store/motorStore'
import { WSMotorStatus, WSMotor1Status, WSMotor2Status, WSTemperatureStatus } from '@/types/websocket'

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null)
  const updateMotorData = useMotorStore((state) => state.updateMotorData)
  const setIsRunning = useMotorStore((state) => state.setIsRunning)
  const setMotor1Pos = useMotorStore((state) => state.setMotor1Pos)
  const setMotor2Pos = useMotorStore((state) => state.setMotor2Pos)
  const setTempValue = useMotorStore((state) => state.setTempValue)

  const connect = () => {
    if (socketRef.current?.connected) return

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000' 
    
    socketRef.current = io(wsUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected')
    })

    socketRef.current.on('motor_status', (message: { data: WSMotorStatus }) => {
      updateMotorData({
        angle: message.data.angle,
        rpm: message.data.rpm,
        temperature: message.data.temperature,
        vibration: message.data.vibration
      })
    })

    socketRef.current.on('motor1_status', (message: { data: WSMotor1Status }) => {
      console.log('Motor1 data received:', message.data)
      setMotor1Pos(message.data.position)
    })

    socketRef.current.on('motor2_status', (message: { data: WSMotor2Status }) => {
      console.log('Motor2 data received:', message.data)
      setMotor2Pos(message.data.position)
    })

    socketRef.current.on('temperature_status', (message: { data: WSTemperatureStatus }) => {
      console.log('Temperature data received:', message.data)
      setTempValue(message.data.value)
    })

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected')
      setIsRunning(false)
    })

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error)
    })
  }

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  return { connect, disconnect, isConnected: socketRef.current?.connected || false }
}