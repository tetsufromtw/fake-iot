'use client'

import { useMotorStore } from '@/store/motorStore'
import { TrendingUp, Gauge, RotateCw, Clock } from 'lucide-react'

export default function StatsPanel() {
  const { angle, rpm, temperature, vibration } = useMotorStore()
  
  const stats = [
    {
      label: 'Current Angle',
      value: `${angle.toFixed(1)}°`,
      icon: RotateCw,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10'
    },
    {
      label: 'RPM',
      value: rpm.toFixed(0),
      icon: Gauge,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      label: 'Temperature',
      value: `${temperature.toFixed(1)}°C`,
      icon: TrendingUp,
      color: temperature > 80 ? 'text-red-400' : 'text-yellow-400',
      bgColor: temperature > 80 ? 'bg-red-400/10' : 'bg-yellow-400/10'
    },
    {
      label: 'Runtime',
      value: '02:34:56',
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    }
  ]
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-300">Motor Statistics</h3>
      
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{stat.label}</span>
            <div className={`${stat.bgColor} p-2 rounded-lg`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <div className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
        </div>
      ))}
      
      {/* 振動指示器 */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Vibration Level</span>
          <span className="text-xs text-gray-500">{vibration.toFixed(2)} mm/s</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(vibration * 10, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}