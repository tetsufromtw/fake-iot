'use client'

import { useWebSocket } from '@/hooks/useWebSocket'
import { useMotorStore } from '@/store/motorStore'
import { Server, Play, Pause, Wifi, WifiOff, Gauge, Thermometer } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function ControlPanel() {
  const { isRunning, setIsRunning, wsConnected, setWsConnected } = useMotorStore()
  const { connect, disconnect } = useWebSocket()
  const { angle, rpm, temperature } = useMotorStore()
  const { motor1_pos, motor2_pos, temp_value} = useMotorStore()

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
    <div className="flex items-center gap-2">
      <Server className="w-5 h-5 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-300">サーバー</h3>
    </div>
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
    <Card>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-300">Motor Statistics</h3>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-400/10 p-3 rounded-lg">
              <Gauge className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Motor Speed 1</p>
              <p className="text-3xl font-bold text-cyan-400">{motor1_pos.toFixed(0)} pulse</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-green-400/10 p-3 rounded-lg">
              <Gauge className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Motor Speed 2</p>
              <p className="text-3xl font-bold text-green-400">{motor2_pos.toFixed(0)} pulse</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-orange-400/10 p-3 rounded-lg">
              <Thermometer className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Temperature</p>
              <p className="text-3xl font-bold text-orange-400">{(temp_value/10).toFixed(1)}°C</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
    </div>
  )
}