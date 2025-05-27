import { create } from 'zustand'

interface MotorState {
  angle: number
  rpm: number
  temperature: number
  vibration: number
  isRunning: boolean
  wsConnected: boolean

  setAngle: (angle: number) => void
  setRpm: (rpm: number) => void
  setTemperature: (temperature: number) => void
  setVibration: (vibration: number) => void
  setIsRunning: (isRunning: boolean) => void
  setWsConnected: (connected: boolean) => void
  updateMotorData: (data: Partial<MotorData>) => void
}

interface MotorData {
  angle: number
  rpm: number
  temperature: number
  vibration: number
}

export const useMotorStore = create<MotorState>((set) => ({
  angle: 0,
  rpm: 0,
  temperature: 25,
  vibration: 0.5,
  isRunning: false,
  wsConnected: false,

  setAngle: (angle) => set({ angle }),
  setRpm: (rpm) => set({ rpm }),
  setTemperature: (temperature) => set({ temperature }),
  setVibration: (vibration) => set({ vibration }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setWsConnected: (wsConnected) => set({ wsConnected }),

  updateMotorData: (data) => set((state) => ({
    ...state,
    ...data
  }))
}))