import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useMotorStore } from '@/store/motorStore'
import { WSMotorStatus } from '@/types/websocket'

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null)
  const updateMotorData = useMotorStore((state) => state.updateMotorData)
  const setIsRunning = useMotorStore((state) => state.setIsRunning)

  const connect = () => {
    if (socketRef.current?.connected) return

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000' // [TODO] 環境変数を使う
    
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