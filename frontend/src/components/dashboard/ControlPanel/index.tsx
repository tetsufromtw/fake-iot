'use client'

import { useWebSocket } from '@/hooks/useWebSocket'
import { useMotorStore } from '@/store/motorStore'
import { Play, Pause, Wifi, WifiOff } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function ControlPanel() {
  const { isRunning, setIsRunning, wsConnected, setWsConnected } = useMotorStore()
  const { connect, disconnect } = useWebSocket()

  const handleToggle = () => {
    if (!isRunning) {
      connect()
      setIsRunning(true)
      setWsConnected(true)
    } else {
      disconnect()
      setIsRunning(false)
      setWsConnected(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Motor Control</h3>

        <button
          onClick={handleToggle}
          className={`
            w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-medium
            transition-all duration-200 transform hover:scale-105
            ${isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
            }
          `}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              Stop Motor
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Motor
            </>
          )}
        </button>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-300">Connection Status</h3>
          <div className="flex items-center gap-2">
            {wsConnected ? (
              <>
                <Wifi className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-400">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">Disconnected</span>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}