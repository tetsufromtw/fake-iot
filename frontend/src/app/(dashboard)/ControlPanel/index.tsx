'use client'

import { useState } from 'react'
import { useMotorStore } from '@/store/motorStore'
import { Play, Pause, RotateCcw, Zap, Settings } from 'lucide-react'

export default function ControlPanel() {
  const { isRunning, setIsRunning, setAngle, setRpm } = useMotorStore()
  const [speed, setSpeed] = useState(50)
  
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    setRpm(newSpeed * 30) 
  }
  
  const handleReset = () => {
    setAngle(0)
    setRpm(0)
    setSpeed(0)
    setIsRunning(false)
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Motor Control</h3>
        

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`
              flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium
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
                Stop
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start
              </>
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium
                     bg-gray-700 hover:bg-gray-600 text-white
                     transition-all duration-200 transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
        

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">
              Speed Control
            </label>
            <span className="text-sm text-cyan-400 font-mono">
              {speed}%
            </span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={speed}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:bg-cyan-500
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:hover:bg-cyan-400
                       [&::-webkit-slider-thumb]:transition-colors"
            />
            <div 
              className="absolute top-0 left-0 h-2 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-lg pointer-events-none"
              style={{ width: `${speed}%` }}
            />
          </div>
        </div>
      </div>
      

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Preset Modes</h3>
        
        <div className="space-y-3">
          <button className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg
                           text-left flex items-center justify-between group transition-colors">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-300">Eco Mode</span>
            </div>
            <span className="text-xs text-gray-500 group-hover:text-gray-400">1200 RPM</span>
          </button>
          
          <button className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg
                           text-left flex items-center justify-between group transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">Normal Mode</span>
            </div>
            <span className="text-xs text-gray-500 group-hover:text-gray-400">1800 RPM</span>
          </button>
          
          <button className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg
                           text-left flex items-center justify-between group transition-colors">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-red-400" />
              <span className="text-gray-300">Turbo Mode</span>
            </div>
            <span className="text-xs text-gray-500 group-hover:text-gray-400">3000 RPM</span>
          </button>
        </div>
      </div>
    </div>
  )
}