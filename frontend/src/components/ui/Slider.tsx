'use client'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  label?: string
  min?: number
  max?: number
}

export default function Slider({
  value,
  onChange,
  label = 'Speed Control',
  min = 0,
  max = 100,
}: SliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <span className="text-sm text-cyan-400 font-mono">{value}%</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 accent-cyan-500"
      />
    </div>
  )
}
