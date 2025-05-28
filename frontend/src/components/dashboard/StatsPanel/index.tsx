'use client'

import { useMotorStore } from '@/store/motorStore'
import { Gauge, Thermometer } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function StatsPanel() {
  const { motor1_pos, motor2_pos, temp_value } = useMotorStore()
  return (
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
              <p className="text-3xl font-bold text-orange-400">{temp_value.toFixed(1)}°C</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}