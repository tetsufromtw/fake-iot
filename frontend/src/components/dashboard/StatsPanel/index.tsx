'use client'

import { useMotorStore } from '@/store/motorStore'
import { Gauge, RotateCw } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function StatsPanel() {
  const { angle, rpm } = useMotorStore()
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-300">Motor Statistics</h3>
      
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-400/10 p-3 rounded-lg">
              <RotateCw className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Current Angle</p>
              <p className="text-3xl font-bold text-cyan-400">{angle.toFixed(1)}°</p>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-green-400/10 p-3 rounded-lg">
              <Gauge className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Motor Speed</p>
              <p className="text-3xl font-bold text-green-400">{rpm.toFixed(0)} RPM</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}