export interface WSMotorStatus {
  angle: number
  rpm: number
  temperature: number
  vibration: number
  timestamp: number
}

export interface WSMotor1Status {
  position: number
  timestamp: number
  last_update: string
}

export interface WSMotor2Status {
  position: number
  timestamp: number
  last_update: string
}

export interface WSTemperatureStatus {
  value: number
  timestamp: number
  last_update: string
}

export interface WSMessage {
  event: string
  data: any
  timestamp?: number
}

export interface WSConnectionStatus {
  status: 'connected' | 'disconnected' | 'error'
  message?: string
}