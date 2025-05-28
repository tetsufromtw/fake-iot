import { create } from 'zustand'

interface MotorState {
  angle: number
  rpm: number
  temperature: number
  vibration: number
  isRunning: boolean
  wsConnected: boolean

  motor1_pos: number
  motor2_pos: number
  temp_value: number

  setAngle: (angle: number) => void
  setRpm: (rpm: number) => void
  setTemperature: (temperature: number) => void
  setVibration: (vibration: number) => void
  setIsRunning: (isRunning: boolean) => void
  setWsConnected: (connected: boolean) => void
  updateMotorData: (data: Partial<MotorData>) => void

  setMotor1Pos: (position: number) => void
  setMotor2Pos: (position: number) => void
  setTempValue: (value: number) => void
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

  motor1_pos: 0,
  motor2_pos: 0,
  temp_value: 24.0,

  setAngle: (angle) => set({ angle }),
  setRpm: (rpm) => set({ rpm }),
  setTemperature: (temperature) => set({ temperature }),
  setVibration: (vibration) => set({ vibration }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setWsConnected: (wsConnected) => set({ wsConnected }),

  updateMotorData: (data) => set((state) => ({
    ...state,
    ...data
  })),

  setMotor1Pos: (position) => set({ motor1_pos: position }),
  setMotor2Pos: (position) => set({ motor2_pos: position }),
  setTempValue: (value) => set({ temp_value: value })
}))