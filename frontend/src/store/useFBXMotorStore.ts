import { create } from 'zustand'

interface MotorState {
  isRunning: boolean
  rpm: number
  angle: number
  setIsRunning: (running: boolean) => void
  setRpm: (rpm: number) => void
  setAngle: (angle: number) => void
}

export const useFBXMotorStore = create<MotorState>((set) => ({
  isRunning: false,
  rpm: 0,
  angle: 0,
  setIsRunning: (isRunning) => set({ isRunning }),
  setRpm: (rpm) => set({ rpm }),
  setAngle: (angle) => set({ angle }),
}))
