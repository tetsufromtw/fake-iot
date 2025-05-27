'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'

export default function ConnectionStatus() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('connected')
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  const statusConfig = {
    connected: {
      icon: Wifi,
      text: 'Connected to MQTT',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      pulseColor: 'bg-green-500'
    },
    disconnected: {
      icon: WifiOff,
      text: 'Disconnected',
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      pulseColor: 'bg-red-500'
    },
    connecting: {
      icon: AlertCircle,
      text: 'Connecting...',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      pulseColor: 'bg-yellow-500'
    }
  }
  
  const config = statusConfig[status]
  const Icon = config.icon
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${config.bgColor} p-2 rounded-lg relative`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
            {status === 'connected' && (
              <div className={`absolute -top-1 -right-1 w-3 h-3 ${config.pulseColor} rounded-full animate-pulse`} />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-300">{config.text}</p>
            <p className="text-xs text-gray-500">Broker: mqtt://localhost:1883</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-gray-500">Last update</p>
          <p className="text-xs text-gray-400">Just now</p>
        </div>
      </div>
    </div>
  )
}